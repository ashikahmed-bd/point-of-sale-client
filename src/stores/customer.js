import apiClient from '@/utils/axios'
import { defineStore } from 'pinia'

export const useCustomerStore = defineStore('customer', {
  state: () => ({
    loading: false,
    errors: {},
    customers: [],
    customer: null,
  }),

  getters: {},

  actions: {
    async selectCustomer(customer) {
      this.customer = customer
    },

    async all() {
      this.loading = true
      try {
        const response = await apiClient.get('/api/customers')

        if (response.status === 200) {
          this.customers = response.data

          this.customer =
            this.customers.data?.find((customer) => customer.name === 'Walk-in Customer') ?? null

          return response.data
        }
      } catch (error) {
        if (error.reponse) {
          throw error.reponse
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
          this.customer = response.data.data
          return response.data
        }
      } catch (error) {
        if (error.reponse) {
          throw error.reponse
        }
      } finally {
        this.loading = false
      }
    },
  },
})
