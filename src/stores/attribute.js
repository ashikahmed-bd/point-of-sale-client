import apiClient from "@/utils/axios";
import { defineStore } from "pinia";

export const useAttributeStore = defineStore("attribute", {
  state: () => ({
    loading: false,
    errors: {},
    attributes: {},
  }),

  getters: {},

  actions: {
    async all() {
      this.loading = true;
      try {
        const response = await apiClient.get("/api/v1/attributes");
        if (response.status === 200) {
          this.attributes = response.data;
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
