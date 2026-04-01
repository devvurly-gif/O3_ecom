import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './assets/main.css'
import api, { setApiKey } from './api/axios'

const app = createApp(App)
app.use(createPinia())
app.use(router)

// Fetch ecom config (API key + shop info) from tenant, then mount
api.get('/config')
  .then(({ data }) => {
    if (data.api_key) setApiKey(data.api_key)
    // Make shop config available globally
    app.provide('shopConfig', data)
  })
  .catch(() => {
    // Fallback: env key already set, or shop not configured
  })
  .finally(() => {
    app.mount('#app')
  })
