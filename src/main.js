import { createApp, watch } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './assets/main.css'
import api from './api/axios'
import { appDataReady } from './composables/useAppReady'

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

// The boot loader lives outside #app (see index.html) so it survives
// Vue's mount. Each entry page calls markAppReady() once its own initial
// data fetch has settled — only then is it safe to reveal real content.
function hideBootLoader() {
  const el = document.getElementById('boot-loader')
  if (!el) return
  el.classList.add('is-hidden')
  setTimeout(() => el.remove(), 300)
}

const stopWatch = watch(appDataReady, (ready) => {
  if (ready) {
    hideBootLoader()
    stopWatch()
  }
})

// Safety net: never leave the whole store stuck behind a spinner if a
// page's fetch hangs or a future page forgets to call markAppReady().
setTimeout(() => {
  if (!appDataReady.value) hideBootLoader()
}, 8000)
