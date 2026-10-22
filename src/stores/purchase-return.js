import apiClient from '@/utils/axios'
import { defineStore } from 'pinia'

export const usePurchaseReturnStore = defineStore('purchase-return', {
  state: () => ({
    loading: false,
    errors: {},
    items: [],
    item: null,
  }),

  getters: {},

  actions: {
    async all(filters = {}) {
      try {
        const response = await apiClient.get('api/purchases/returns', {
          params: filters,
        })
        this.items = response.data
        return response.data
      } catch (error) {
        throw error
      }
    },

    async store(payload) {
      this.loading = true
      try {
        const response = await apiClient.post('api/purchases/returns', payload)
        return response.data
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async show(id) {
      this.loading = true
      try {
        const response = await apiClient.get(`api/purchases/returns/${id}`)
        this.item = response.data?.data
        return response.data
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },
  },
})
