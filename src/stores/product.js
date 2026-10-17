import apiClient from '@/utils/axios'
import { defineStore } from 'pinia'

export const useProductStore = defineStore('product', {
  state: () => ({
    loading: false,
    errors: {},
    products: [],
    product: null,
  }),

  getters: {},

  actions: {
    async all(search = {}) {
      this.loading = true
      try {
        const response = await apiClient.get('/api/products', {
          params: search,
        })
        this.products = response.data
        return response.data
      } catch (error) {
        throw error.reponse ?? error
      } finally {
        this.loading = false
      }
    },

    async store(formData) {
      this.loading = true
      try {
        const response = await apiClient.post('/api/products', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        this.product = response.data
        return response
      } catch (error) {
        throw error.reponse ?? error
      } finally {
        this.loading = false
      }
    },

    async show(product) {
      try {
        const response = await apiClient.get(`/api/products/${product}`)
        this.product = response.data?.data
        return response
      } catch (error) {
        throw error.reponse ?? error
      }
    },

    async update(product, payload) {
      this.loading = true
      try {
        const response = await apiClient.put(`/api/v1/products/${product}`, payload)
        return response.data
      } catch (error) {
        throw error.reponse ?? error
      } finally {
        this.loading = false
      }
    },

    async media(product, payload) {
      this.loading = true
      try {
        const response = await apiClient.post(`/api/v1/products/${product}/media`, payload)
        return response.data
      } catch (error) {
        throw error.response ?? error
      } finally {
        this.loading = false
      }
    },

    async search(search = {}) {
      this.loading = true
      try {
        const response = await apiClient.get('/api/products/search', {
          params: search,
        })
        this.products = response.data
        return response.data
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },
  },
})
