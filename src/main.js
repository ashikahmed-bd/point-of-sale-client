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

app.use(pinia)
app.use(router)
app.use(ui)
app.mount('#app')
