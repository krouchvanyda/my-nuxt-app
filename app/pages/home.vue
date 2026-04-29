<template>
  <div class="p-6">
    <!-- bloc title and acttions -->
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold mb-4">Products from API</h1>

      <button @click="visible = true" class="bg-green-500 text-white p-2 rounded hover:bg-green-600">
        <i class="pi pi-plus" style="color: white"></i>
        Add Product
      </button>
    </div>
    <!-- bloc loading -->
    <div v-if="store.isLoading && store.page === 1" class="flex justify-center mb-4">
        <ProgressSpinner aria-label="Loading" style="width:50px;height:50px;stroke: #ff0000"/>
    </div>
      <!-- bloc error -->
    <div v-else-if="store.error" class="text-red-500">{{ store.error }}</div>
    <div v-else-if="store.products.length === 0" class="text-gray-500 flex items-center justify-center">No products found</div>
    <!-- bloc list product -->
    <div v-else class="grid grid-cols-3 gap-4">
      <NuxtLink
        v-for="product in store.products"
        :key="product.id"
        :to="{ name: 'products-id', params: { id: product.id } }"
        class="border p-4 rounded shadow"
      >
      <div class="relative">
        <img 
            :src="'https://www.siemreapshuttle.com/wp-content/uploads/2023/06/Cultural-and-Historical-Background-of-Angkor-Wat.jpg'" 
            alt="" 
            class="w-full object-cover mb-2" 
        />
        <i @click.stop.prevent="onEdit(product)" class="pi pi-pen-to-square absolute top-2 right-2 text-white bg-black/50 p-1 rounded" style="color: white"></i>
        <i @click.stop.prevent="onDelete(product.id)" class="pi pi-trash absolute bottom-2 right-2 text-white bg-black/50 p-1 rounded" style="color: red"></i>
      </div>
        
        <!-- <img :src="product.images[0]" alt="no image" class="w-full h-40 object-cover mb-2" /> -->
        <h2 class="font-bold text-lg">{{ product.title }}</h2>
        <p class="text-green-500 font-bold">${{ product.price }}</p>
        <p class="text-sm text-gray-500">{{ product.description }}</p>
      </NuxtLink>
    </div>


    <!-- Loading more -->
    <div v-if="store.isLoading && store.page > 1" class="text-center my-4">
      Loading more...
    </div>

    <!-- No more -->
    <div v-if="!store.hasMore" class="text-center text-gray-500 my-4">
      No more products
    </div>
  </div>
  <BaseDialog v-model:visible="visible" :header="titleHeader" @hide="handleClose">
     <BaseForm 
        :isLoading="loading"
        submitText="Save"
        @submit="handleSaveOrEdit"
        :error="error"
      >
        <BaseInput
          v-model="form.title"
          placeholder="Title"
        />
        <BaseInput
          v-model="form.price"
          placeholder="Price"
          type="number"
        />
        <BaseInput
          v-model="form.description"
          placeholder="Description"
        />
      </BaseForm>
  </BaseDialog>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { useProductStore } from '../stores/product'
const { $apiService } = useNuxtApp();
const store = useProductStore()
const visible = ref(false);
const loading = ref(false)
const titleHeader = ref("Create Product")
const error = ref("")
let lastScrollY = 0;
const defaultForm = {
  id: 0,
  title: "",
  price: "",
  description: "",
  categoryId: 1,
  images: ["https://placehold.co/600x400"]
}
const form = reactive({ ...defaultForm })
const handleClose = () => {
  visible.value = false
  titleHeader.value = "Create Product"
  Object.assign(form, defaultForm)
}
const onEdit = (product) => {
  titleHeader.value = "Edit Product"
  Object.assign(form, {
    id: product.id,
    title: product.title,
    price: product.price,
    description: product.description,
    categoryId: product.categoryId,
    images: [...(product.images || [])]
  })
  visible.value = true
}
const onDelete = async (productId) => {
  loading.value = true
  error.value = ""
  try {
   // ================= API CALL Delete Product =================
    await $apiService.delete(`/products/${productId}`)
    store.reset()
    store.productPagination()
  } catch (err) {
    error.value = "Invalid id "
  } finally {
    loading.value = false
  }
}
const handleSaveOrEdit = async () => {
  // ================= VALIDATION =================
  if (!form.title || !form.price || !form.description) {
    error.value = "Title, price, and description are required"
    return
  }

  loading.value = true
  error.value = ""

  try {
    if(form.id === 0){
      // ================= API CALL Create Product =================
      await $apiService.post("/products", {
        title: form.title,
        price: Number(form.price),
        description: form.description,
        categoryId: form.categoryId,
        images: form.images
      })
    
    } else {
      // ================= API CALL Update Product =================
      await $apiService.put(`/products/${form.id}`, {
        title: form.title,
        price: Number(form.price),
        description: form.description,
        categoryId: form.categoryId,
        images: form.images
      })
    }
    visible.value = false
    Object.assign(form, defaultForm)
    store.reset()
    store.productPagination()
  } catch (err) {
    error.value = "Invalid title or price or description "
  } finally {
    loading.value = false
  }
}
onMounted(() => {
  store.reset()
  store.productPagination()

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY

    // load more (down scroll)
    if (
      currentScrollY > lastScrollY &&
      window.innerHeight + currentScrollY >= document.body.offsetHeight - 100 &&
      !store.isLoading &&
      store.hasMore
    ) {
      store.productPagination()
    }

    lastScrollY = currentScrollY
  })
})
</script>