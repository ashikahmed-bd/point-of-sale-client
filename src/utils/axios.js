import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000', // http://127.0.0.1:8000
  withCredentials: false,
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    const cartStore = useCartStore()

    if (authStore.token) {
      config.headers['Authorization'] = `Bearer ${authStore.token}`
      config.headers['X-Store-ID'] = authStore.store?.id ?? null
    }

    if (cartStore.cart?.token) {
      config.headers['X-Cart-Token'] = cartStore.cart?.token
    }

    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If server returned a response (401, 422, 500 etc.)
    if (error.response) {
      if (error.response.status === 401) {
        // Logout user
        const authStore = useAuthStore()
        authStore.$reset()

        // DO NOT return navigateTo — reject error so catch() works
        window.location.href = '/login'

        // send the error to catch()
        return Promise.reject(error)
      }

      // For all other errors → pass to catch()
      return Promise.reject(error)
    }

    // If no response (network error etc.)
    return Promise.reject(error)
  },
)

export default apiClient
