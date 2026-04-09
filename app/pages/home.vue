<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Products from API</h1>
    <!-- bloc loading -->
    <div v-if="store.isLoading" class="flex justify-center mb-4">
        <ProgressSpinner aria-label="Loading" style="width:50px;height:50px;stroke: #ff0000"/>
    </div>
      <!-- bloc error -->
    <div v-else-if="store.error" class="text-red-500">{{ store.error }}</div>
    <!-- bloc list product -->
    <div v-else="store.products.length" class="grid grid-cols-3 gap-4">
      <NuxtLink
        v-for="product in store.products"
        :key="product.id"
        :to="{ name: 'products-id', params: { id: product.id } }"
        class="border p-4 rounded shadow"
      >
        <img 
            :src="'https://www.siemreapshuttle.com/wp-content/uploads/2023/06/Cultural-and-Historical-Background-of-Angkor-Wat.jpg'" 
            alt="" 
            class="w-full object-cover mb-2" 
        />
        <!-- <img :src="product.images[0]" alt="no image" class="w-full h-40 object-cover mb-2" /> -->
        <h2 class="font-bold text-lg">{{ product.title }}</h2>
        <p class="text-green-500 font-bold">${{ product.price }}</p>
        <p class="text-sm text-gray-500">{{ product.description }}</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useProductStore } from '../stores/product'

const store = useProductStore()

onMounted(() => {
  store.fetchProducts()
})
</script>