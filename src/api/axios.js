import axios from 'axios'

/**
 * Auto-detect tenant API URL from hostname.
 *
 * shop.jadeverfes.o3app.ma  → https://jadeverfes.o3app.ma/api/ecom
 * shop.demo.o3app.ma        → https://demo.o3app.ma/api/ecom
 * localhost:5174             → http://o3_app.test/api/ecom (dev fallback)
 */
function detectApiBaseUrl() {
  const host = window.location.hostname
  const protocol = window.location.protocol

  // Dev fallback
  if (host === 'localhost' || host === '127.0.0.1') {
    return import.meta.env.VITE_API_BASE_URL || 'http://o3_app.test/api/ecom'
  }

  // Production: strip "shop." prefix to get tenant domain
  const tenantHost = host.replace(/^shop\./, '')
  return `${protocol}//${tenantHost}/api/ecom`
}

function detectStorageBaseUrl() {
  const host = window.location.hostname
  const protocol = window.location.protocol

  if (host === 'localhost' || host === '127.0.0.1') {
    const base = import.meta.env.VITE_API_BASE_URL || 'http://o3_app.test/api/ecom'
    return base.replace('/api/ecom', '')
  }

  const tenantHost = host.replace(/^shop\./, '')
  return `${protocol}//${tenantHost}`
}

export const API_BASE_URL = detectApiBaseUrl()
export const STORAGE_BASE_URL = detectStorageBaseUrl()

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
})

// API key: use env in dev, or fetched dynamically in prod
let apiKey = import.meta.env.VITE_API_KEY || null

export function setApiKey(key) {
  apiKey = key
}

api.interceptors.request.use((config) => {
  if (apiKey) {
    config.headers['X-Ecom-Api-Key'] = apiKey
  }
  return config
})

export default api
