import apiClient from '@/utils/axios'
import { defineStore } from 'pinia'

export const useStoreStore = defineStore('store', {
  state: () => ({
    loading: false,
    errors: {},
    stores: [],
    selected: null,
  }),

  getters: {},

  actions: {
    async switch(store) {
      this.loading = true
      try {
        const response = await apiClient.post('api/stores/switch', {
          store: store,
        })
        if (response.status === 200) {
          this.selected = response.data
          return response.data
        }
      } catch (error) {
        if (error) {
          return Promise.reject(error.response?.data?.errors)
        }
      } finally {
        this.loading = false
      }
    },
  },
})
