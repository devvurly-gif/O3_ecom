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
      promotions.value = data.data ?? data
    } catch (e) {
      console.error('Failed to fetch promotions:', e)
    } finally {
      loading.value = false
    }
  }

  async function fetchSlides() {
    try {
      const { data } = await api.get('/slides')
      slides.value = data.data ?? data
    } catch (e) {
      console.error('Failed to fetch slides:', e)
    }
  }

  return { promotions, slides, loading, fetchPromotions, fetchSlides }
})
