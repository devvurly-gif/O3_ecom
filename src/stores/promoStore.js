import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/axios'

export const usePromoStore = defineStore('promo', () => {
  const promotions = ref([])
  const slides = ref([])
  const loading = ref(false)

  async function fetchPromotions() {
    loading.value = true
    try {
      const { data } = await api.get('/promotions')
      promotions.value = Array.isArray(data) ? data : (data?.data ?? [])
    } catch (e) {
      console.error('Failed to fetch promotions:', e)
    } finally {
      loading.value = false
    }
  }

  async function fetchSlides(position = 'hero') {
    try {
      const { data } = await api.get('/slides', { params: { position } })
      slides.value = Array.isArray(data) ? data : (data?.data ?? [])
    } catch (e) {
      console.error('Failed to fetch slides:', e)
    }
  }

  return { promotions, slides, loading, fetchPromotions, fetchSlides }
})
