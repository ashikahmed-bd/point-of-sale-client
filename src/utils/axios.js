import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import router from '@/router'

const apiClient = axios.create({
  baseURL: 'https://pos.gazisportsbd.com', // https://pos.gazisportsbd.com http://localhost:8000
  withCredentials: false,
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    const cartStore = useCartStore()

    // Auth token
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }

    // Cart token
    if (cartStore.cart?.token) {
      config.headers['X-Cart-Token'] = cartStore.cart.token
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response
  },

  async (error) => {
    // Server returned a response
    if (error.response) {
      const status = error.response.status

      // Unauthorized
      if (status === 401) {
        const authStore = useAuthStore()

        // Clear authentication state
        authStore.$reset()

        // Redirect to login
        await router.push('/login')

        // Keep the original error for caller's catch()
        return Promise.reject(error)
      }

      // Validation error, forbidden, not found, server error etc.
      return Promise.reject(error)
    }

    // Network / connection error
    return Promise.reject(error)
  },
)

export default apiClient
