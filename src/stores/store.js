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
    async all() {
      this.loading = true
      try {
        const response = await apiClient.get('/api/stores')
        this.stores = response.data
        return response.data
      } catch (error) {
        throw error.reponse ?? error
      } finally {
        this.loading = false
      }
    },

    async search(keywords) {
      this.loading = true
      try {
        const response = await apiClient.get('/api/stores/search', {
          params: {
            keywords: keywords,
          },
        })
        this.stores = response.data
        return response.data
      } catch (error) {
        throw error.reponse ?? error
      } finally {
        this.loading = false
      }
    },

    async switch(store) {
      this.loading = true
      try {
        const response = await apiClient.post('api/stores/switch', {
          store: store,
        })
        this.selected = response.data
        return response.data
      } catch (error) {
        throw error.reponse ?? error
      } finally {
        this.loading = false
      }
    },
  },
})
