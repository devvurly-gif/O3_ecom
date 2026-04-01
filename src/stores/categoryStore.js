import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/axios'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref([])
  const loading = ref(false)

  async function fetchCategories() {
    if (categories.value.length) return
    loading.value = true
    try {
      const { data } = await api.get('/categories')
      categories.value = data.data ?? data
    } catch (e) {
      console.error('Failed to fetch categories:', e)
    } finally {
      loading.value = false
    }
  }

  return { categories, loading, fetchCategories }
})
