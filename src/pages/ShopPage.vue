<template>
  <div class="mx-auto max-w-9xl px-4 sm:px-6 lg:px-2 py-2 sm:py-2">
    <!-- Header -->
    <div class="flex p-2">
      <h1 class="text-2xl sm:text-3xl text-ink flex-1">Boutique</h1>
      <p v-if="store.pagination.total" class="text-lg text-neutral-600 pt-4">{{ store.pagination.total }} produits</p>
    </div>
    <hr class="hr mb-10" />

    <div class="flex flex-col lg:flex-row gap-10" style="padding-top: 0.5rem;">
      <!-- Sidebar filters -->
      <div class="w-full lg:w-64 shrink-0">
        <ProductFilters
          :categories="categoryStore.categories"
          :selected-category="filters.category_id"
          :brands="brandStore.brands"
          :selected-brand="filters.brand_id"
          :price-min="filters.price_min"
          :price-max="filters.price_max"
          :sort-by="filters.sort"
          @filter-category="setCategory"
          @filter-brand="setBrand"
          @filter-price="setPrice"
          @sort="setSort"
        />
      </div>

      <!-- Products -->
      <div class="flex-1">
        <LoadingSpinner v-if="store.loading" />
        <template v-else>
          <ProductGrid v-if="store.products.length" :products="store.products" />
          <div v-else class="flex flex-col items-center justify-center py-20 text-center">
            <MagnifyingGlassIcon class="h-12 w-12 text-neutral-400" />
            <p class="mt-4 text-neutral-600">Aucun produit trouvé</p>
            <button @click="resetFilters" class="btn-ghost mt-4 font-bold text-sm">Réinitialiser les filtres</button>
          </div>
          <Pagination
            :current-page="store.pagination.currentPage"
            :last-page="store.pagination.lastPage"
            @change-page="changePage"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '@/stores/productStore'
import { useCategoryStore } from '@/stores/categoryStore'
import { useBrandStore } from '@/stores/brandStore'
import ProductGrid from '@/components/product/ProductGrid.vue'
import ProductFilters from '@/components/product/ProductFilters.vue'
import Pagination from '@/components/ui/Pagination.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const store = useProductStore()
const categoryStore = useCategoryStore()
const brandStore = useBrandStore()

const filters = reactive({
  search: route.query.search || '',
  category_id: route.query.category ? Number(route.query.category) : null,
  brand_id: route.query.brand ? Number(route.query.brand) : null,
  price_min: route.query.price_min ? Number(route.query.price_min) : null,
  price_max: route.query.price_max ? Number(route.query.price_max) : null,
  sort: route.query.sort || '',
  page: route.query.page ? Number(route.query.page) : 1,
})

function loadProducts() {
  const params = { per_page: 12, page: filters.page }
  if (filters.search) params.search = filters.search
  if (filters.category_id) params.category_id = filters.category_id
  if (filters.brand_id) params.brand_id = filters.brand_id
  if (filters.price_min != null) params.price_min = filters.price_min
  if (filters.price_max != null) params.price_max = filters.price_max
  if (filters.sort) params.sort = filters.sort
  store.fetchProducts(params)
}

function updateQuery() {
  const query = {}
  if (filters.search) query.search = filters.search
  if (filters.category_id) query.category = filters.category_id
  if (filters.brand_id) query.brand = filters.brand_id
  if (filters.price_min != null) query.price_min = filters.price_min
  if (filters.price_max != null) query.price_max = filters.price_max
  if (filters.sort) query.sort = filters.sort
  if (filters.page > 1) query.page = filters.page
  router.replace({ query })
}

function setCategory(id) {
  filters.category_id = id
  filters.page = 1
  updateQuery()
  loadProducts()
}

function setBrand(id) {
  filters.brand_id = id
  filters.page = 1
  updateQuery()
  loadProducts()
}

function setPrice({ min, max }) {
  filters.price_min = min
  filters.price_max = max
  filters.page = 1
  updateQuery()
  loadProducts()
}

function setSort(val) {
  filters.sort = val
  filters.page = 1
  updateQuery()
  loadProducts()
}

function changePage(page) {
  filters.page = page
  updateQuery()
  loadProducts()
}

function resetFilters() {
  filters.search = ''
  filters.category_id = null
  filters.brand_id = null
  filters.price_min = null
  filters.price_max = null
  filters.sort = ''
  filters.page = 1
  updateQuery()
  loadProducts()
}

watch(() => route.query, (q) => {
  filters.search = q.search || ''
  filters.category_id = q.category ? Number(q.category) : null
  filters.brand_id = q.brand ? Number(q.brand) : null
  filters.price_min = q.price_min ? Number(q.price_min) : null
  filters.price_max = q.price_max ? Number(q.price_max) : null
  filters.sort = q.sort || ''
  filters.page = q.page ? Number(q.page) : 1
  loadProducts()
})

onMounted(() => {
  categoryStore.fetchCategories()
  brandStore.fetchBrands()
  loadProducts()
})
</script>
