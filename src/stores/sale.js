import apiClient from '@/utils/axios'
import { defineStore } from 'pinia'
import { toast } from '@/utils/toast'

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
        const response = await apiClient.post('/api/sales', payload)
        if (response.status === 201) {
          toast.success(response.data.message)
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
  },
})
