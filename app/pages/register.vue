<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md bg-white p-6 rounded-xl shadow">

      <h1 class="text-2xl font-bold mb-6 text-center text-blue-950">Register</h1>

      <form @submit.prevent="handleRegister" class="space-y-4">
        
        <!-- Email -->
        <input
            v-model="form.name"
            type="text"
            placeholder="Name"
            class="w-full border border-gray-500 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:border-blue-500 text-black"
        />

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
          {{ loading ? "Registering..." : "Register" }}
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
  name: "John",
  email: "john@mail.com",
  password: "changeme",
  avatar: "https://picsum.photos/800",
})

const handleRegister = async () => {
  // ================= VALIDATION =================
  if (!form.name ||!form.email || !form.password) {
    error.value = "Name, email and password are required"
    return
  }

  loading.value = true
  error.value = ""

  try {
    // ================= API CALL =================
    const res = await $apiService.post("/users", {
      name: form.name,
      email: form.email,
      password: form.password,
      avatar: form.avatar,
    })

    // ================= SAVE User =================
    auth.addSession({
      user: res.data,
    })

    // ================= REDIRECT =================
    await navigateTo("/login")
  } catch (err) {
    error.value = "Invalid name, email or password"
  } finally {
    loading.value = false
  }
}
</script>