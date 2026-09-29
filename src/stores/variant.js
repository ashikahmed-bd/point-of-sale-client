import apiClient from "@/utils/axios";
import { defineStore } from "pinia";

export const useVariantStore = defineStore("variant", {
  state: () => ({
    loading: false,
    errors: {},
  }),

  getters: {},

  actions: {
    async store(product, payload) {
      this.loading = true;
      try {
        const response = await apiClient.post(
          `/api/v1/products/${product}/variants`,
          payload,
        );

        if (response.status === 200) {
          return Promise.resolve(response.data);
        }
      } catch (error) {
        if (error.reponse) {
          return Promise.reject(error.reponse.data.errors);
        }
      } finally {
        this.loading = false;
      }
    },
  },
});
