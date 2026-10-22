import apiClient from '@/utils/axios'
import { defineStore } from 'pinia'

export const usePurchaseStore = defineStore('purchase', {
  state: () => ({
    loading: false,
    errors: {},
    purchases: [],
    purchase: [],
    items: [],
    discount: 0,
    tax: 0,
    shipping: 0,
    charge: 0,
    paid: 0,
  }),

  persist: {
    pick: ['items'],
  },

  getters: {
    subtotal: (state) =>
      state.items.reduce(
        (total, item) => total + Number(item.unit_cost) * Number(item.quantity),
        0,
      ),

    total() {
      return Math.max(
        0,
        this.subtotal -
          Number(this.discount ?? 0) +
          Number(this.tax ?? 0) +
          Number(this.shipping ?? 0) +
          Number(this.charge ?? 0),
      )
    },

    due() {
      return Math.max(0, this.total - Number(this.paid ?? 0))
    },
  },

  actions: {
    addItem(product) {
      console.log('addItem called:', product)
      const existing = this.items.find(
        (item) => item.id === product.id && (item.variant_id ?? '') === (product.variant_id ?? ''),
      )

      if (existing) {
        existing.quantity = Number(product.quantity ?? 1)
        existing.unit_cost = Number(product.unit_cost ?? product.cost_price ?? 0)
        existing.discount = Number(product.discount ?? 0)
        existing.tax = Number(product.tax ?? 0)

        existing.meta = {
          ...(existing.meta ?? {}),
          ...(product.meta ?? {}),
        }

        return
      }

      this.items.push({
        id: product.id,
        name: product.name,
        sku: product.sku,
        base_price: product.base_price,
        price: product.price,
        variant_id: product.variant_id ?? '',

        quantity: Number(product.quantity),
        unit_cost: Number(product.unit_cost),
        discount: Number(product.discount),
        tax: Number(product.tax),

        meta: {
          ...(product.meta ?? {}),
        },
        serials: [],
      })
    },

    removeItem(product) {
      this.items = this.items.filter((item) => item.id !== product)
    },

    async addSerial(product) {
      const item = this.items.find((item) => item.id === product.id)

      if (!item) return

      while (item.serials.length < Number(item.quantity)) {
        item.serials.push({
          serial_number: '',
          imei: '',
          status: 'in_stock',
          purchase_date: new Date().toISOString().slice(0, 10),
          condition: 'new',
          notes: '',
        })
      }
    },

    async selectedVariant(product, variant) {
      const item = this.items.find((item) => item.id === product.id)

      if (!item) return

      item.variant_id = variant
    },

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
        return response
      } catch (error) {
        throw error.response ?? error
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
