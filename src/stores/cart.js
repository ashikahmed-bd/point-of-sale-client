import apiClient from '@/utils/axios'
import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    loading: false,
    holding: false,
    errors: {},
    cart: null,
    dialog: false,
    item: null,
  }),

  persist: {
    pick: ['cart'],
  },

  getters: {},

  actions: {
    async getCart() {
      try {
        const response = await apiClient.get('/api/cart')

        this.cart = response.data?.data
        return response.data?.data
      } catch (error) {
        throw error.reponse.data ?? error
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
        return response
      } catch (error) {
        throw error.reponse ?? error
      } finally {
        this.loading = false
      }
    },

    async update(item, payload) {
      this.loading = true
      try {
        const response = await apiClient.put(`/api/cart/items/${item}`, payload)
        this.dialog = false

        return response
      } catch (error) {
        throw error.reponse ?? error
      } finally {
        this.loading = false
      }
    },

    async increment(item) {
      try {
        const response = await apiClient.post(`/api/cart/items/${item}/increment`)
        await this.getCart()
        return response.data
      } catch (error) {
        throw error.response.data ?? error
      }
    },

    async decrement(item) {
      try {
        const response = await apiClient.post(`/api/cart/items/${item}/decrement`)
        await this.getCart()
        return response.data
      } catch (error) {
        throw error.response.data ?? error
      }
    },

    async remove(item) {
      try {
        const response = await apiClient.delete(`/api/cart/items/${item}`)
        await this.getCart()
        return response.data
      } catch (error) {
        throw error.response.data ?? error
      }
    },

    async discount(payload) {
      this.loading = true
      try {
        const response = await apiClient.patch(`/api/cart/discount`, payload)
        return response.data
      } catch (error) {
        throw error.reponse.data ?? error
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

        return response.data
      } catch (error) {
        throw error.reponse.data ?? error
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

    async holdCart(customer) {
      if (!this.cart?.items?.length) {
        throw new Error('Cannot hold an empty cart.')
      }

      this.holding = true
      try {
        const response = await apiClient.post('/api/sales/hold', {
          customer_id: customer ?? null,
        })

        this.$reset()
        await this.getCart()

        return response.data
      } catch (error) {
        throw error.reponse.data ?? error
      } finally {
        this.holding = false
      }
    },

    async edit(item) {
      this.dialog = true
      this.item = item
    },
  },
})
