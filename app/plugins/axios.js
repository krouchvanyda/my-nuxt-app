import axios from "axios"
import { useAuthStore } from "~/stores/auth"

export default defineNuxtPlugin((nuxtApp) => {
    var baseURL = "https://api.escuelajs.co/api/v1"
    const auth = useAuthStore()

    // =========================
    // 🌐 Axios instance
    // =========================
    const api = axios.create({
        baseURL: baseURL,  /// Platzi Fake Store API
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
         
        // 🟡 LOG REQUEST
      
        console.log("print------>url-api: ", `${config.baseURL}${config.url}`)
        console.log("print------>Method: ", `${config.method}`)
        console.log("print------>Param->QueryParameters: ", `${JSON.stringify(config.params || {})}`)
        console.log("print------>Param->Data: ", `${JSON.stringify(config.data || {})}`)

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
        (response) =>{

            // 🟢 LOG SUCCESS RESPONSE
            console.log(`response Method: [${response.config.method}] Success`)
            
            // console.log("response Data:", `${JSON.stringify(response.data)}`)
    
            return response
        },
        async (error) => {
            const originalRequest = error.config
            // 🔴 LOG ERROR
           
            console.log("response error:", `[${originalRequest?.method}] Error -> ${error.message}`)

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
                        `${baseURL}/auth/refresh-token`,
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
        // 🔵 GET
        get: (url, config = {}) => api.get(url, config),

        // 🟢 POST
        post: (url, data = {}, config = {}) =>
            api.post(url, data, config),

        // 🟡 PUT
        put: (url, data = {}, config = {}) =>
            api.put(url, data, config),

        // 🔴 DELETE
        delete: (url, config = {}) =>
            api.delete(url, config),
    }

    return {
        provide: {
            api,
            apiService,
        },
    }
})