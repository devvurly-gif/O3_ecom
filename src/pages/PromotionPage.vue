<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Promotions</h1>
    <p class="text-gray-500 dark:text-gray-400 mb-8">Profitez de nos meilleures offres</p>

    <LoadingSpinner v-if="loading" />

    <template v-else>
      <!-- Promo banners -->
      <div v-if="!slug && promotions.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <router-link
          v-for="promo in promotions"
          :key="promo.id"
          :to="{ name: 'promotion', params: { slug: promo.slug } }"
          class="group rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 p-6 text-white hover:from-primary-700 hover:to-primary-900 transition"
        >
          <span class="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
            {{ promo.type === 'percentage' ? `-${promo.value}%` : `-${promo.value} MAD` }}
          </span>
          <h3 class="mt-3 text-lg font-bold">{{ promo.name }}</h3>
          <p v-if="promo.description" class="mt-1 text-sm text-primary-100 line-clamp-2">{{ promo.description }}</p>
        </router-link>
      </div>

      <!-- Products -->
      <ProductGrid v-if="products.length" :products="products" />
      <div v-else class="py-20 text-center text-gray-500 dark:text-gray-400">
        Aucun produit en promotion actuellement
      </div>

      <Pagination
        :current-page="pagination.currentPage || 1"
        :last-page="pagination.lastPage || 1"
        @change-page="changePage"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import api from '@/api/axios'
import ProductGrid from '@/components/product/ProductGrid.vue'
import Pagination from '@/components/ui/Pagination.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const props = defineProps({ slug: { type: String, default: '' } })

const products = ref([])
const promotions = ref([])
const pagination = ref({})
const loading = ref(true)

async function load(page = 1) {
  loading.value = true
  try {
    const [prodRes, promoRes] = await Promise.all([
      api.get('/products', { params: { promo: true, per_page: 12, page } }),
      api.get('/promotions'),
    ])
    products.value = prodRes.data.data  // paginated — interceptor keeps intact
    promotions.value = promoRes.data     // unwrapped by interceptor
    if (prodRes.data.current_page) {
      pagination.value = {
        currentPage: prodRes.data.current_page,
        lastPage: prodRes.data.last_page,
      }
    }
  } catch (e) {
    console.error('Failed to load promotions:', e)
  } finally {
    loading.value = false
  }
}

function changePage(page) {
  load(page)
}

onMounted(() => load())
watch(() => props.slug, () => load())
</script>
