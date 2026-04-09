import { defineStore } from "pinia";
var url = "https://api.escuelajs.co/api/v1/products"
export const useProductStore = defineStore("product", {
    state: () => ({
        products: [],
        isLoading: true,
        product: null,
        error: null,
    }),
    actions: {
        /// bloc get products
        async fetchProducts() {
            this.isLoading = true
            this.error = null
            try {
                const data = await $fetch(url)
               this.products = data
            } catch (err) {
                this.error = err || 'Unknown error'
            } finally {
                this.isLoading = false
            }
        },

        /// bloc get product by id
        async fetchProductById(id) {
            this.isLoading = true
            this.error = null
            try {
                const data = await $fetch(`${url}/${id}`);
               this.product = data
            } catch (err) {
                this.error = err || 'Unknown error'
            } finally {
                this.isLoading = false
            }
        },
    }
})