<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md bg-white p-6 rounded-xl shadow">

      <h1 class="text-2xl font-bold mb-6 text-center text-blue-950">Register</h1>
     <BaseForm 
      :isLoading="loading"
      submitText="Register"
      @submit="handleRegister"
      :error="error"
     >
      <BaseInput
        v-model="form.name"
        placeholder="Name"
      />
      <BaseInput
        v-model="form.email"
        placeholder="Email"
      />
      <BaseInput
        v-model="form.password"
        placeholder="Password"
        type="password"
      />
    </BaseForm>
    <div class="flex justify-center mt-4 space-x-1">
        <p
          class="flex items-center justify-center text-black"
        >
          Already have an account? 
        </p>
        <NuxtLink
          to="/login"
          class="flex items-center justify-center text-green-500 hover:text-green-700 "
        >
          Login
        </NuxtLink>
    </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue"
import BaseInput from "~/components/base/BaseInput.vue";
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