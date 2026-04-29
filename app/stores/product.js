import { defineStore } from "pinia";
export const useProductStore = defineStore("product", {
    state: () => ({
        products: [],
        isLoading: false,
        product: null,
        error: null,
        page: 1,
        limit: 10,
        hasMore: true,
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

        // ✅ Pagination (Load More)
        async productPagination() {
            const { $apiService } = useNuxtApp();

            // duplicate call
            if (this.isLoading || !this.hasMore) return;

            this.isLoading = true;
            this.error = null;

            try {
                const offset = (this.page - 1) * this.limit;

                const res = await $apiService.get(
                    `/products?offset=${offset}&limit=${this.limit}`
                );

                const newData = res.data;

                // append data
                this.products.push(...newData);

                // check end
                if (newData.length < this.limit) {
                    this.hasMore = false;
                }

                this.page++;

            } catch (err) {
                this.error = err.message || "Failed to fetch products";
            } finally {
                this.isLoading = false;
            }
        },

        // ✅ Reset
        reset() {
            this.products = [];
            this.page = 1;
            this.hasMore = true;
        },

    },
});
