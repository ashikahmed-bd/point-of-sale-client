import apiClient from '@/utils/axios'
import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    loading: false,
    errors: {},
    cart: null,
  }),

  persist: {
    pick: ['cart'],
  },

  getters: {},

  actions: {
    async getCart() {
      try {
        const response = await apiClient.get('/api/cart')

        if (response.status >= 200 && response.status < 300) {
          this.cart = response.data?.data
          return response.data?.data
        }
      } catch (error) {
        if (error.reponse) {
          return Promise.reject(error.reponse.data.errors)
        }
      } finally {
        this.loading = false
      }
    },

    async add(product) {
      this.loading = true
      try {
        const response = await apiClient.post(`/api/cart/items`, {
          product_id: product.id,
          quantity: 1,
        })

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

    async increment(item) {
      try {
        const response = await apiClient.post(`/api/cart/items/${item}/increment`)

        await this.getCart()

        return response
      } catch (error) {
        throw error.response
      }
    },

    async decrement(item) {
      try {
        const response = await apiClient.post(`/api/cart/items/${item}/decrement`)

        await this.getCart()

        return response
      } catch (error) {
        throw error.response
      }
    },

    async remove(item) {
      try {
        const response = await apiClient.delete(`/api/cart/items/${item}`)
        await this.getCart()

        return response
      } catch (error) {
        if (error.reponse) {
          throw error.response
        }
      }
    },

    async discount(payload) {
      this.loading = true
      try {
        const response = await apiClient.patch(`/api/cart/discount`, payload)

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

    async shipping(payload) {
      this.loading = true
      try {
        const response = await apiClient.patch(`/api/cart/shipping`, {
          shipping: Number(payload),
        })

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

    async reset() {
      this.loading = true
      try {
        this.cart = null
        return await this.getCart()
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },
  },
})
