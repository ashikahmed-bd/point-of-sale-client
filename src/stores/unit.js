import apiClient from '@/utils/axios'
import { defineStore } from 'pinia'

export const useUnitStore = defineStore('unit', {
  state: () => ({
    loading: false,
    errors: {},
    units: [],
  }),

  getters: {},

  actions: {
    async all() {
      this.loading = true
      try {
        const response = await apiClient.get('/api/units')

        if (response.status === 200) {
          this.units = response.data
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
