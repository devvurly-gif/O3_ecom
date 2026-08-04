<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-2xl sm:text-3xl text-ink mb-2">Promotions</h1>
    <p class="text-neutral-600 mb-8">Profitez de nos meilleures offres</p>

    <LoadingSpinner v-if="loading" />

    <template v-else>
      <!-- Promo banners -->
      <div v-if="!slug && promotions.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <router-link
          v-for="promo in promotions"
          :key="promo.id"
          :to="{ name: 'promotion', params: { slug: promo.slug } }"
          class="card border border-divider hover:bg-neutral-100 transition"
        >
          <span class="tag tag-outline self-start">
            {{ promo.type === 'percentage' ? `-${promo.value}%` : `-${formatPrice(promo.value)}` }}
          </span>
          <h3 class="card-title">{{ promo.name }}</h3>
          <p v-if="promo.description" class="card-body line-clamp-2">{{ promo.description }}</p>
          <div class="card-meta justify-between">
            <span v-if="promo.ends_at">Jusqu'au {{ new Date(promo.ends_at).toLocaleDateString('fr-FR') }}</span>
            <span v-if="promo.products_count">{{ promo.products_count }} produit{{ promo.products_count > 1 ? 's' : '' }}</span>
          </div>
        </router-link>
      </div>

      <!-- Products -->
      <ProductGrid v-if="products.length" :products="products" />
      <div v-else class="py-20 text-center text-neutral-600">
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
import { formatPrice } from '@/composables/useFormatPrice'

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
    products.value = Array.isArray(prodRes.data) ? prodRes.data : (prodRes.data?.data ?? [])
    promotions.value = Array.isArray(promoRes.data) ? promoRes.data : (promoRes.data?.data ?? [])
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
