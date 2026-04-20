

/// global auth

import { defineStore } from "pinia"

export const useAuthStore = defineStore("auth", {
  state: () => ({
    accessToken: null,
    refreshToken: null,
    user: null,
  }),

  actions: {
    addSession({ user }) {
      this.user = user
      localStorage.setItem("user", JSON.stringify(user))
    },
    setSession({ accessToken, refreshToken, user }) {
      this.accessToken = accessToken
      this.refreshToken = refreshToken
      this.user = user

      localStorage.setItem("access_token", accessToken)
      localStorage.setItem("refresh_token", refreshToken)
      localStorage.setItem("user", JSON.stringify(user))
    },

    loadFromStorage() {
      this.accessToken = localStorage.getItem("access_token")
      this.refreshToken = localStorage.getItem("refresh_token")
      this.user = JSON.parse(localStorage.getItem("user") || "null")

    },
  

    clearSession() {
      this.accessToken = null
      this.refreshToken = null
      this.user = null

      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
      localStorage.removeItem("user")
    },
  },
})