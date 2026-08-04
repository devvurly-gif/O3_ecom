import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/axios'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref([])
  const loading = ref(false)

  // Le garde « si déjà chargé, on sort » ne suffisait pas : la navbar et la
  // page d'accueil appellent fetchCategories dans le même tick, aucune des
  // deux n'a encore de résultat, et la requête partait deux fois. On conserve
  // la promesse en cours pour que le second appelant s'y raccroche.
  let enCours = null

  function fetchCategories() {
    if (categories.value.length) return Promise.resolve(categories.value)
    if (enCours) return enCours

    loading.value = true
    enCours = api.get('/categories')
      .then(({ data }) => {
        categories.value = Array.isArray(data) ? data : (data?.data ?? [])
        return categories.value
      })
      .catch((e) => {
        console.error('Failed to fetch categories:', e)
        return []
      })
      .finally(() => {
        loading.value = false
        enCours = null
      })

    return enCours
  }

  return { categories, loading, fetchCategories }
})
