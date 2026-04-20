// import axios from "axios"

// export default defineNuxtPlugin(() => {

//   // =========================
//   // 🌐 Axios instance
//   // =========================
//   const api = axios.create({
//     baseURL: "https://api.escuelajs.co/api/v1", /// Platzi Fake Store API
//     timeout: 10000,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   })

//   // =========================
//   // 🔐 Optional: Request interceptor
//   // (example: token injection)
//   // =========================
//   api.interceptors.request.use((config) => {
//     // const token = localStorage.getItem("token")
//     // if (token) config.headers.Authorization = `Bearer ${token}`
//     return config
//   })

//   // =========================
//   // 📦 API METHODS WRAPPER
//   // =========================
//   const apiService = {
    
//     // 🔵 GET
//     get: (url, params = {}) => {
//       return api.get(url, { params })
//     },

//     // 🟢 POST
//     post: (url, data = {}) => {
//       return api.post(url, data)
//     },

//     // 🟡 PUT
//     put: (url, data = {}) => {
//       return api.put(url, data)
//     },

//     // 🔴 DELETE
//     delete: (url) => {
//       return api.delete(url)
//     },
//   }

//   return {
//     provide: {
//       api,        // raw axios instance
//       apiService, // clean CRUD wrapper ⭐
//     },
//   }
// })




/// api with login

import axios from "axios"
import { useAuthStore } from "~/stores/auth"

export default defineNuxtPlugin((nuxtApp) => {
  const auth = useAuthStore()

  // =========================
  // 🌐 Axios instance
  // =========================
  const api = axios.create({
    baseURL: "https://api.escuelajs.co/api/v1",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  })

  // =========================
  // 🔐 REQUEST INTERCEPTOR
  // =========================
  api.interceptors.request.use((config) => {
    const token = auth.accessToken || localStorage.getItem("access_token")

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  })

  // =========================
  // 🔁 REFRESH CONTROL
  // =========================
  let isRefreshing = false
  let failedQueue = []

  const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error)
      } else {
        prom.resolve(token)
      }
    })

    failedQueue = []
  }

  // =========================
  // 🚨 RESPONSE INTERCEPTOR
  // =========================
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config

      // ❌ If 401 → try refresh token
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          }).then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          })
        }

        isRefreshing = true

        try {
          const refreshToken =
            auth.refreshToken || localStorage.getItem("refresh_token")

          // 🔄 CALL REFRESH API (change endpoint if needed)
          const res = await axios.post(
            "https://api.escuelajs.co/api/v1/auth/refresh-token",
            {
              refreshToken,
            }
          )

          const newAccessToken = res.data.access_token

          // 💾 update store
          auth.accessToken = newAccessToken
          localStorage.setItem("access_token", newAccessToken)

          api.defaults.headers.Authorization = `Bearer ${newAccessToken}`

          processQueue(null, newAccessToken)

          return api(originalRequest)
        } catch (err) {
          processQueue(err, null)
          auth.clearSession()

          navigateTo("/login")
          return Promise.reject(err)
        } finally {
          isRefreshing = false
        }
      }

      return Promise.reject(error)
    }
  )

  // =========================
  // 📦 API METHODS WRAPPER (YOUR ORIGINAL)
  // =========================
  const apiService = {
    get: (url, params = {}) => api.get(url, { params }),

    post: (url, data = {}) => api.post(url, data),

    put: (url, data = {}) => api.put(url, data),

    delete: (url) => api.delete(url),
  }

  return {
    provide: {
      api,
      apiService,
    },
  }
})