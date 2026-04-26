import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './assets/main.css'
import api from './api/axios'

const app = createApp(App)
app.use(createPinia())
app.use(router)

// Fetch public ecom config (shop info: name/logo/phone/email/address)
// from the tenant. The API key is NOT returned anymore (security audit
// C3) — it's baked at build time via VITE_API_KEY in axios.js.
api.get('/config')
  .then(({ data }) => {
    // Make shop config available globally
    app.provide('shopConfig', data)
  })
  .catch(() => {
    // Boot anyway; pages will surface their own errors.
  })
  .finally(() => {
    app.mount('#app')
  })
