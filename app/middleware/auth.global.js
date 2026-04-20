
import { useAuthStore } from "~/stores/auth"

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()

  // prevent SSR mismatch
  if (process.server) return

  auth.loadFromStorage()

  const isLoggedIn = !!auth.accessToken

  if (to.path === "/login") return

  if (!isLoggedIn) {
    return navigateTo("/login")
  }
})