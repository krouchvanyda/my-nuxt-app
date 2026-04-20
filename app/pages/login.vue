<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md bg-white p-6 rounded-xl shadow">

      <h1 class="text-2xl font-bold mb-6 text-center text-blue-950">Login</h1>

      <form @submit.prevent="handleLogin" class="space-y-4">

        <!-- Email -->
        <input
            v-model="form.email"
            type="email"
            placeholder="Email"
            class="w-full border border-gray-500 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:border-blue-500 text-black"
        />
        <!-- Password -->
        <input
          v-model="form.password"
          type="password"
          placeholder="Password"
        class="w-full border border-gray-500 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:border-blue-500 text-black"
        />

        <!-- Button -->
        <button
          type="submit"
          class="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
          :disabled="loading"
        >
          {{ loading ? "Logging in..." : "Login" }}
        </button>

        <p v-if="error" class="text-red-500 text-sm text-center">
          {{ error }}
        </p>

      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue"
import { useAuthStore } from "~/stores/auth"

const auth = useAuthStore();
const { $apiService } = useNuxtApp();

const loading = ref(false)
const error = ref("")

const form = reactive({
  email: "",
  password: "",
})

const handleLogin = async () => {
  // ================= VALIDATION =================
//   if (!form.email || !form.password) {
//     error.value = "Email and password are required"
//     return
//   }

  loading.value = true
  error.value = ""

  try {
    // ================= API CALL =================
    const res = await $apiService.post("/auth/login", {
      email: form.email,
      password: form.password,
    })

    

    // ================= SAVE AUTH =================
    auth.setSession({
      accessToken: res.data.access_token,
      refreshToken: res.data.refresh_token,
      user: res.data.user,
    })

    // ================= REDIRECT =================
    await navigateTo("/")
  } catch (err) {
    error.value = "Invalid email or password"
  } finally {
    loading.value = false
  }
}
</script>