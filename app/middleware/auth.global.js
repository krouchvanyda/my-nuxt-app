import { useAuthStore } from "~/stores/auth"

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()

  //  SSR issue
  if (process.server) return

  // load auth from localStorage
  auth.loadFromStorage()

  const isLoggedIn = !!auth.accessToken

  // =========================
  // 🌐 PUBLIC ROUTES
  // =========================
  const publicPages = ["/login", "/register"]

  // =========================
  // 🚫 NOT LOGGED IN
  // =========================
  if (!isLoggedIn && !publicPages.includes(to.path)) {
    auth.clearSession() // optional but recommended
    return navigateTo("/login")
  }

  // =========================
  // 🔐 ALREADY LOGGED IN
  // =========================
  if (isLoggedIn && publicPages.includes(to.path)) {
    return navigateTo("/")
  }
})