import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/axios'

export const usePromoStore = defineStore('promo', () => {
  const promotions = ref([])
  const slides = ref([])
  const loading = ref(false)

  // Même raison que dans categoryStore : la navbar et la page d'accueil
  // demandaient les promotions simultanément, d'où deux requêtes identiques.
  let promosEnCours = null
  let slidesEnCours = null

  function fetchPromotions() {
    if (promotions.value.length) return Promise.resolve(promotions.value)
    if (promosEnCours) return promosEnCours

    loading.value = true
    promosEnCours = api.get('/promotions')
      .then(({ data }) => {
        promotions.value = Array.isArray(data) ? data : (data?.data ?? [])
        return promotions.value
      })
      .catch((e) => {
        console.error('Failed to fetch promotions:', e)
        return []
      })
      .finally(() => {
        loading.value = false
        promosEnCours = null
      })

    return promosEnCours
  }

  function fetchSlides(position = 'hero') {
    if (slidesEnCours) return slidesEnCours

    slidesEnCours = api.get('/slides', { params: { position } })
      .then(({ data }) => {
        slides.value = Array.isArray(data) ? data : (data?.data ?? [])
        return slides.value
      })
      .catch((e) => {
        console.error('Failed to fetch slides:', e)
        return []
      })
      .finally(() => { slidesEnCours = null })

    return slidesEnCours
  }

  return { promotions, slides, loading, fetchPromotions, fetchSlides }
})
