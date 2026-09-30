import apiClient from '@/utils/axios'
import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    loading: false,
    errors: {},
    items: [],
  }),

  getters: {
    itemsCount: (state) => {
      return state.items.reduce((total, item) => {
        return total + item.quantity
      }, 0)
    },

    subtotal: (state) => {
      return state.items.reduce((total, item) => {
        return total + Number(item.price) * item.quantity
      }, 0)
    },

    discount: (state) => {
      return state.items.reduce((total, item) => {
        return total + Number(item.discount ?? 0) * item.quantity
      }, 0)
    },

    tax: (state) => {
      return state.items.reduce((total, item) => {
        const price = Number(item.price) * item.quantity
        const taxRate = Number(item.tax_rate ?? 0)

        return total + (price * taxRate) / 100
      }, 0)
    },

    total() {
      return this.subtotal - this.discount + this.tax
    },

    isEmpty: (state) => state.items.length === 0,
  },

  actions: {
    async add(product) {
      this.loading = true
      try {
        const response = await apiClient.post(`/api/v1/products/${product}/variants`, payload)

        if (response.status === 200) {
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
