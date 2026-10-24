import apiClient from '@/utils/axios'
import { defineStore } from 'pinia'

export const useCustomerStore = defineStore('customer', {
  state: () => ({
    loading: false,
    errors: {},
    customers: [],
    customer: null,
    sales: [],
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
        return response
      } catch (error) {
        throw error.reponse ?? error
      } finally {
        this.loading = false
      }
    },

    async show(customer) {
      try {
        const response = await apiClient.get(`/api/customers/${customer}`)
        this.customer = response.data
        return response.data
      } catch (error) {
        throw error.reponse ?? error
      }
    },

    async update(customer, payload) {
      this.loading = true
      try {
        const response = await apiClient.put(`/api/customers/${customer}`, payload)
        return response
      } catch (error) {
        throw error.reponse ?? error
      } finally {
        this.loading = false
      }
    },

    async delete(customer) {
      try {
        const response = await apiClient.delete(`/api/customers/${customer}`)
        return response
      } catch (error) {
        throw error.reponse ?? error
      }
    },

    async getSales(customer) {
      try {
        const response = await apiClient.get(`/api/customers/${customer}/sales`)
        console.log(response.data)
        this.sales = response.data
        return response.data
      } catch (error) {
        throw error.reponse ?? error
      }
    },
  },
})
