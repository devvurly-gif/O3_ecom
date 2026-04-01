import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/axios'

export const useProductStore = defineStore('product', () => {
  const products = ref([])
  const product = ref(null)
  const loading = ref(false)
  const pagination = ref({})

  async function fetchProducts(params = {}) {
    loading.value = true
    try {
      const { data } = await api.get('/products', { params })
      products.value = data.data
      pagination.value = {
        currentPage: data.current_page,
        lastPage: data.last_page,
        perPage: data.per_page,
        total: data.total,
      }
    } catch (e) {
      console.error('Failed to fetch products:', e)
    } finally {
      loading.value = false
    }
  }

  async function fetchProduct(slug) {
    loading.value = true
    product.value = null
    try {
      const { data } = await api.get(`/products/${slug}`)
      product.value = data.data ?? data
    } catch (e) {
      console.error('Failed to fetch product:', e)
    } finally {
      loading.value = false
    }
  }

  return { products, product, loading, pagination, fetchProducts, fetchProduct }
})
