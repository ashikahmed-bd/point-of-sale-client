import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

import App from './App.vue'
import router from './router'
import ui from '@nuxt/ui/vue-plugin'

const app = createApp(App)

app.config.globalProperties.$currency = (amount, code = 'BDT') => {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: code,
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(amount))
}

app.config.globalProperties.$date = (date) => {
  if (!date) return 'N/A'

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

app.config.globalProperties.$dateTime = (date) => {
  if (!date) return 'N/A'

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(date))
}

app.use(pinia)
app.use(router)
app.use(ui)
app.mount('#app')
