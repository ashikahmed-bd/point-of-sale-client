import apiClient from '@/utils/axios'
import { defineStore } from 'pinia'

export const useCustomerStore = defineStore('customer', {
  state: () => ({
    loading: false,
    errors: {},
    customers: [],
  }),

  getters: {},

  actions: {
    async all() {
      this.loading = true
      try {
        const response = await apiClient.get('/api/customers')

        if (response.status === 200) {
          this.customers = response.data
          return Promise.resolve(response.data)
        }
      } catch (error) {
        if (error.reponse) {
          return Promise.reject(error.reponse.data.errors)
        }
      } finally {
        this.loading = false
      }
    },

    async store(payload) {
      this.loading = true
      try {
        const response = await apiClient.post('/api/customers', payload)

        if (response.status === 201) {
          return Promise.resolve(response.data)
        }
      } catch (error) {
        if (error.reponse) {
          return Promise.reject(error.reponse.data.errors)
        }
      } finally {
        this.loading = false
      }
    },
  },
})
