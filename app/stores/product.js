import { defineStore } from "pinia";
export const useProductStore = defineStore("product", {
    state: () => ({
        products: [],
        isLoading: true,
        product: null,
        error: null,
    }),
    actions: {

        // ✅ GET ALL PRODUCTS
        async fetchProducts() {
            const { $apiService } = useNuxtApp();

            this.isLoading = true;
            this.error = null;

            try {
                const res = await $apiService.get("/products");
                this.products = res.data;
            } catch (err) {
                this.error = err.message;
            } finally {
                this.isLoading = false;
            }
        },

        // ✅ GET PRODUCT BY ID
        async fetchProductById(id) {
            const { $apiService } = useNuxtApp();

            this.isLoading = true;
            this.error = null;

            try {
                const res = await $apiService.get(`/products/${id}`);
                this.product = res.data;
            } catch (err) {
                this.error = err.message;
            } finally {
                this.isLoading = false;
            }
        },
    },
});
