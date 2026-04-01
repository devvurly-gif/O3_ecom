<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Boutique</h1>
      <p v-if="store.pagination.total" class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ store.pagination.total }} produits</p>
    </div>

    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Sidebar filters (desktop) -->
      <div class="hidden lg:block w-64 shrink-0">
        <ProductFilters
          :categories="categoryStore.categories"
          :selected-category="filters.category_id"
          :sort-by="filters.sort"
          @filter-category="setCategory"
          @sort="setSort"
        />
      </div>

      <!-- Mobile filters -->
      <div class="lg:hidden flex gap-3">
        <select
          @change="setCategory($event.target.value ? Number($event.target.value) : null)"
          class="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300"
        >
          <option value="">Toutes les categories</option>
          <option v-for="cat in categoryStore.categories" :key="cat.id" :value="cat.id" :selected="filters.category_id === cat.id">
            {{ cat.name }}
          </option>
        </select>
        <select
          @change="setSort($event.target.value)"
          class="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300"
        >
          <option value="">Trier par</option>
          <option value="newest">Plus recents</option>
          <option value="price_asc">Prix croissant</option>
          <option value="price_desc">Prix decroissant</option>
          <option value="name">Nom A-Z</option>
        </select>
      </div>

      <!-- Products -->
      <div class="flex-1">
        <LoadingSpinner v-if="store.loading" />
        <template v-else>
          <ProductGrid v-if="store.products.length" :products="store.products" />
          <div v-else class="flex flex-col items-center justify-center py-20 text-center">
            <MagnifyingGlassIcon class="h-12 w-12 text-gray-300 dark:text-gray-600" />
            <p class="mt-4 text-gray-500 dark:text-gray-400">Aucun produit trouve</p>
            <button @click="resetFilters" class="mt-4 text-sm font-medium text-primary-600 hover:text-primary-700">Reinitialiser les filtres</button>
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
import ProductGrid from '@/components/product/ProductGrid.vue'
import ProductFilters from '@/components/product/ProductFilters.vue'
import Pagination from '@/components/ui/Pagination.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const store = useProductStore()
const categoryStore = useCategoryStore()

const filters = reactive({
  search: route.query.search || '',
  category_id: route.query.category ? Number(route.query.category) : null,
  sort: route.query.sort || '',
  page: route.query.page ? Number(route.query.page) : 1,
})

function loadProducts() {
  const params = { per_page: 12, page: filters.page }
  if (filters.search) params.search = filters.search
  if (filters.category_id) params.category_id = filters.category_id
  if (filters.sort) params.sort = filters.sort
  store.fetchProducts(params)
}

function updateQuery() {
  const query = {}
  if (filters.search) query.search = filters.search
  if (filters.category_id) query.category = filters.category_id
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
  filters.sort = ''
  filters.page = 1
  updateQuery()
  loadProducts()
}

watch(() => route.query, (q) => {
  filters.search = q.search || ''
  filters.category_id = q.category ? Number(q.category) : null
  filters.sort = q.sort || ''
  filters.page = q.page ? Number(q.page) : 1
  loadProducts()
})

onMounted(() => {
  categoryStore.fetchCategories()
  loadProducts()
})
</script>
