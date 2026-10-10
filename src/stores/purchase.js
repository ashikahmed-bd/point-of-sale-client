import apiClient from '@/utils/axios'
import { defineStore } from 'pinia'

export const usePurchaseStore = defineStore('purchase', {
  state: () => ({
    loading: false,
    errors: {},
    purchases: [],
    purchase: [],
  }),

  getters: {},

  actions: {
    async all(filters = {}) {
      try {
        const response = await apiClient.get('api/purchases', {
          params: filters,
        })
        this.purchases = response.data
        return response.data
      } catch (error) {
        throw error
      }
    },

    async store(payload) {
      this.loading = true
      try {
        const response = await apiClient.post('api/purchases', payload)
        return response.data
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async show(purchase) {
      try {
        const response = await apiClient.get(`/api/purchases/${purchase}`)
        this.purchase = response.data?.data
        return response.data
      } catch (error) {
        throw error
      }
    },
  },
})
