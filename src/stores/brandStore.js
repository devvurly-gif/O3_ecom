import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/axios'

export const useBrandStore = defineStore('brand', () => {
  const brands = ref([])
  const loading = ref(false)

  async function fetchBrands() {
    if (brands.value.length) return
    loading.value = true
    try {
      const { data } = await api.get('/brands')
      brands.value = data
    } catch (e) {
      console.error('Failed to fetch brands:', e)
    } finally {
      loading.value = false
    }
  }

  return { brands, loading, fetchBrands }
})
