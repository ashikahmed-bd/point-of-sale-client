import apiClient from '@/utils/axios'
import { defineStore } from 'pinia'

export const useSaleStore = defineStore('sale', {
  state: () => ({
    loading: false,
    errors: {},
    sales: [],
    sale: [],
  }),

  getters: {},

  actions: {
    async all() {
      this.loading = true
      try {
        const response = await apiClient.get('/api/sales')
        if (response.status === 200) {
          this.sales = response.data
          return Promise.resolve(response.data)
        }
      } catch (error) {
        if (error.reponse) {
          return Promise.reject(error.reponse?.data?.errors)
        }
      } finally {
        this.loading = false
      }
    },

    async store(payload) {
      this.loading = true
      try {
        return await apiClient.post('/api/sales', payload)
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors
          throw error.response
        }

        throw error
      } finally {
        this.loading = false
      }
    },

    async getRecentSales() {
      try {
        const response = await apiClient.get('/api/sales/recent')
        this.sales = response.data
        return response
      } catch (error) {
        throw error.response || error
      }
    },
  },
})
