<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md bg-white p-6 rounded-xl shadow">

      <h1 class="text-2xl font-bold mb-6 text-center text-blue-950">Login</h1>
      <BaseForm
        submitText="Login"
        :isLoading="loading"
        @submit="handleLogin"
        :error="error"
      >
        <BaseInput
          v-model="form.email"
          type="email"
          placeholder="Email"
        />
        <BaseInput
          v-model="form.password"
          type="password"
          placeholder="Password"
        />
      </BaseForm>
    
        <div class="flex justify-center mt-4">
            <NuxtLink
                to="/register"
                class="flex items-center justify-center text-green-500 hover:text-green-700 "
            >
                Register
            </NuxtLink>
        </div>
  
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
  if (!form.email || !form.password) {
    error.value = "Email and password are required"
    return
  }

  loading.value = true
  error.value = ""

  try {
    // ================= API CALL Login =================
    const res = await $apiService.post("/auth/login", {
      email: form.email,
      password: form.password,
    })
    //  {
    //     "email": "john@mail.com",
    //     "password": "changeme"
    // }
    const token = res.data.access_token

    auth.accessToken = token
    // ================= API CALL Get Profile=================
    const profile = await $apiService.get("/auth/profile")

    // ================= SAVE AUTH =================
    auth.setSession({
      accessToken: token,
      refreshToken: res.data.refresh_token,
      user: profile.data,
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