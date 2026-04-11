<template>
  <header class="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-b border-gray-100 dark:border-gray-800 transition-colors">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-2">
          <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white font-bold text-lg">
            O3
          </div>
          <span class="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">Store</span>
        </router-link>

        <!-- Nav links (desktop) -->
        <nav class="hidden md:flex items-center gap-1">
          <router-link to="/" class="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition rounded-lg">Accueil</router-link>

          <!-- Boutique dropdown -->
          <div class="relative" @mouseenter="openDropdown('shop')" @mouseleave="closeDropdown('shop')">
            <router-link to="/shop" class="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition rounded-lg">
              Boutique
              <ChevronDownIcon class="h-3.5 w-3.5" />
            </router-link>
            <Transition
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="opacity-0 translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-1"
            >
              <div v-if="dropdowns.shop" class="absolute left-0 top-full mt-1 w-56 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-lg py-2 z-50">
                <router-link
                  to="/shop"
                  class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
                                  >
                  Tous les produits
                </router-link>
                <div v-if="categoryStore.categories.length" class="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
                  <p class="px-4 py-1.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Categories</p>
                  <router-link
                    v-for="cat in categoryStore.categories"
                    :key="cat.id"
                    :to="{ name: 'shop', query: { category: cat.id } }"
                    class="flex items-center justify-between px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400"
                                      >
                    <span>{{ cat.name }}</span>
                    <span v-if="cat.products_count != null" class="text-xs text-gray-400 dark:text-gray-500">{{ cat.products_count }}</span>
                  </router-link>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Promotions dropdown -->
          <div class="relative" @mouseenter="openDropdown('promos')" @mouseleave="closeDropdown('promos')">
            <router-link to="/promotions" class="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition rounded-lg">
              Promotions
              <ChevronDownIcon v-if="promoStore.promotions.length" class="h-3.5 w-3.5" />
            </router-link>
            <Transition
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="opacity-0 translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-1"
            >
              <div v-if="dropdowns.promos && promoStore.promotions.length" class="absolute left-0 top-full mt-1 w-56 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-lg py-2 z-50">
                <router-link
                  to="/promotions"
                  class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
                                  >
                  Toutes les promotions
                </router-link>
                <div class="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
                  <router-link
                    v-for="promo in promoStore.promotions"
                    :key="promo.id"
                    :to="{ name: 'promotion', params: { slug: promo.slug } }"
                    class="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400"
                                      >
                    <span class="inline-flex items-center rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      {{ promo.type === 'percentage' ? `-${promo.value}%` : `-${promo.value}` }}
                    </span>
                    <span class="truncate">{{ promo.name }}</span>
                  </router-link>
                </div>
              </div>
            </Transition>
          </div>
        </nav>

        <!-- Right side -->
        <div class="flex items-center gap-2">
          <!-- Theme toggle -->
          <button @click="theme.toggle()" class="rounded-full p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <MoonIcon v-if="!theme.dark" class="h-5 w-5" />
            <SunIcon v-else class="h-5 w-5 text-yellow-400" />
          </button>

          <!-- Search toggle -->
          <button @click="searchOpen = !searchOpen" class="rounded-full p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <MagnifyingGlassIcon class="h-5 w-5" />
          </button>

          <!-- Cart button -->
          <button @click="cart.drawerOpen = true" class="relative rounded-full p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <ShoppingBagIcon class="h-5 w-5" />
            <span
              v-if="cart.totalItems > 0"
              class="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white"
            >
              {{ cart.totalItems }}
            </span>
          </button>

          <!-- Mobile menu -->
          <button @click="mobileOpen = !mobileOpen" class="md:hidden rounded-full p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <Bars3Icon class="h-5 w-5" />
          </button>
        </div>
      </div>

      <!-- Search bar -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-if="searchOpen" class="pb-4">
          <form @submit.prevent="handleSearch" class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher des produits..."
              class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 py-3 pl-11 pr-4 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-primary-500 focus:bg-white dark:focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              ref="searchInput"
            />
            <MagnifyingGlassIcon class="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
          </form>
        </div>
      </Transition>
    </div>

    <!-- Mobile nav -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="mobileOpen" class="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-4 space-y-1">
        <router-link to="/" class="block rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Accueil</router-link>
        <router-link to="/shop" class="block rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Tous les produits</router-link>

        <!-- Mobile categories -->
        <div v-if="categoryStore.categories.length" class="pl-4 space-y-1">
          <router-link
            v-for="cat in categoryStore.categories"
            :key="cat.id"
            :to="{ name: 'shop', query: { category: cat.id } }"
            class="block rounded-lg px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
            {{ cat.name }}
          </router-link>
        </div>

        <router-link to="/promotions" class="block rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Promotions</router-link>

        <!-- Mobile promotions -->
        <div v-if="promoStore.promotions.length" class="pl-4 space-y-1">
          <router-link
            v-for="promo in promoStore.promotions"
            :key="promo.id"
            :to="{ name: 'promotion', params: { slug: promo.slug } }"
            class="block rounded-lg px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
            {{ promo.name }}
          </router-link>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { ref, reactive, watch, nextTick, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { useThemeStore } from '@/stores/themeStore'
import { useCategoryStore } from '@/stores/categoryStore'
import { usePromoStore } from '@/stores/promoStore'
import { ShoppingBagIcon, MagnifyingGlassIcon, Bars3Icon, MoonIcon, SunIcon, ChevronDownIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()
const cart = useCartStore()
const theme = useThemeStore()
const categoryStore = useCategoryStore()
const promoStore = usePromoStore()

const searchOpen = ref(false)
const mobileOpen = ref(false)
const searchQuery = ref('')
const searchInput = ref(null)

const dropdowns = reactive({ shop: false, promos: false })
let closeTimers = {}

function openDropdown(key) {
  clearTimeout(closeTimers[key])
  dropdowns[key] = true
}

function closeDropdown(key) {
  closeTimers[key] = setTimeout(() => { dropdowns[key] = false }, 150)
}

function closeAll() {
  dropdowns.shop = false
  dropdowns.promos = false
}

// Close mobile menu + search on any route change
watch(() => route.fullPath, () => {
  mobileOpen.value = false
  searchOpen.value = false
  closeAll()
})

watch(searchOpen, (val) => {
  if (val) nextTick(() => searchInput.value?.focus())
})

function handleSearch() {
  if (searchQuery.value.trim()) {
    router.push({ name: 'shop', query: { search: searchQuery.value.trim() } })
    searchOpen.value = false
    searchQuery.value = ''
  }
}

onMounted(() => {
  categoryStore.fetchCategories()
  promoStore.fetchPromotions()
})
</script>
