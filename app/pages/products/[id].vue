<template>
    <h1 class="text-2xl font-bold mb-4  flex justify-center my-6">Products from API</h1>
    <!-- bloc loading -->
    <div v-if="store.isLoading" class="flex justify-center mb-4">
        <ProgressSpinner aria-label="Loading" style="width:50px;height:50px;stroke: #ff0000"/>
    </div>
      <!-- bloc error -->
    <div v-else-if="store.error" class="text-red-500">{{ store.error }}</div>
    <div v-else class="grid grid-cols-3 gap-4 ml-3 mb-6">
      <div
        class="border p-4 rounded shadow"
      >
        <img 
            :src="'https://www.siemreapshuttle.com/wp-content/uploads/2023/06/Cultural-and-Historical-Background-of-Angkor-Wat.jpg'" 
            alt="" 
            class="w-full object-cover mb-2" 
        />
        <h2 class="font-bold text-lg">{{ store.product.title }}</h2>
        <p class="text-green-500 font-bold">${{ store.product.price }}</p>
        <p class="text-sm text-gray-500">{{ store.product.description }}</p>
      </div>
    </div>
</template>


<script setup>
import { onMounted } from 'vue'
import { useProductStore } from '../../stores/product'

const route = useRoute()
const store = useProductStore()
// onMounted(async () => {
//   console.log("Route ID:", route.params.id)

//   // ✅ Wait for API call
//   await store.fetchProductById(route.params.id)

//   console.log("Fetched product:", store.product)
// })

/// can use watch get data

watch(() => route.params.id, (id) => {
  if (id) store.fetchProductById(id)
}, { immediate: true })

</script>