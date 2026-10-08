import apiClient from '@/utils/axios'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    loading: false,
    errors: {},
    token: null,
    user: null,
    store: null,
  }),

  // persist: true,
  persist: {
    pick: ['token', 'user', 'store'],
  },

  getters: {
    loggedIn: (state) => !!state.token,
  },

  actions: {
    setStore(store) {
      console.log('Setting store:', store)
      this.store = store
    },

    async login(formData) {
      this.loading = true

      try {
        const response = await apiClient.post('/api/auth/login', formData)

        if (response.status === 200) {
          this.token = response.data.token
          this.store = response.data.store
        }

        return response
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors
          throw error.response
        }

        throw error
      } finally {
        this.loading = false
      }
    },

    async register(formData) {
      this.loading = true
      try {
        const response = await apiClient.post('/api/auth/register', formData)
        if (response.status === 201) {
          return Promise.resolve(response.data)
        }
      } catch (error) {
        this.errors = error.response.data.errors
      } finally {
        this.loading = false
      }
    },

    async getUser() {
      if (this.user) return this.user
      try {
        const token = this.token
        if (!token) throw new Error('No token found')

        const response = await apiClient.get('/api/auth/user')
        this.user = response.data.data
      } catch (error) {
        this.errors = error.response?.data?.errors
      } finally {
        this.loading = false
      }
    },

    async forgot(formData) {
      this.loading = true
      try {
        const response = await apiClient.post('/api/auth/forgot', formData)
        if (response.status === 200) {
        }
      } catch (error) {
        this.errors = error.response?.data?.errors
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        const response = await apiClient.post('/api/auth/logout')
        if (response.status === 200) {
          this.$reset()
          window.location.href = '/login'
        }
      } catch (error) {
        if (error.response) {
          return Promise.reject(error.response.data)
        }
      } finally {
        this.loading = false
      }
    },
  },
})
