import apiClient from '@/utils/axios'
import { defineStore } from 'pinia'

export const useSaleStore = defineStore('sale', {
  state: () => ({
    loading: false,
    errors: {},
    sales: [],
    sale: [],
    recent: [],
    drafts: [],
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
        throw error
      } finally {
        this.loading = false
      }
    },

    async show(sale) {
      try {
        const response = await apiClient.get(`/api/sales/${sale}`)
        this.sale = response.data
        return response.data
      } catch (error) {
        throw error.response ?? error
      }
    },

    async getRecentSales() {
      try {
        const response = await apiClient.get('/api/sales/recent')
        this.recent = response.data
        return response
      } catch (error) {
        throw error
      }
    },

    async getDraftsSales() {
      try {
        const response = await apiClient.get('/api/sales/drafts')
        this.drafts = response.data
        return response
      } catch (error) {
        throw error
      }
    },
  },
})
