import apiClient from "@/utils/axios";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    loading: false,
    errors: {},
    users: [],
    user: {},
  }),

  getters: {},

  actions: {
    async all() {
      this.loading = true;
      try {
        const response = await apiClient.get("/api/v1/users");
        if (response.status === 200) {
          this.users = response.data;
          return Promise.resolve(response.data);
        }
      } catch (error) {
        if (error.reponse) {
          return Promise.reject(error.reponse?.data?.errors);
        }
      } finally {
        this.loading = false;
      }
    },
  },
});
