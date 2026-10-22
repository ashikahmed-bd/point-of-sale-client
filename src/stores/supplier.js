import apiClient from '@/utils/axios'
import { defineStore } from 'pinia'

export const useSupplierStore = defineStore('supplier', {
  state: () => ({
    loading: false,
    errors: {},
    suppliers: [],
  }),

  getters: {},

  actions: {
    async all(filters = {}) {
      this.loading = true
      try {
        const response = await apiClient.get('/api/suppliers', {
          params: filters,
        })
        this.suppliers = response.data
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
        const response = await apiClient.get('/api/suppliers', {
          params: {
            keywords: keywords,
          },
        })
        this.suppliers = response.data
        return response.data
      } catch (error) {
        throw error.reponse ?? error
      } finally {
        this.loading = false
      }
    },
  },
})
