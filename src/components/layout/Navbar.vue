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
        <nav class="hidden md:flex items-center gap-8">
          <router-link to="/" class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition">Accueil</router-link>
          <router-link to="/shop" class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition">Boutique</router-link>
          <router-link to="/promotions" class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition">Promotions</router-link>
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
      <div v-if="mobileOpen" class="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-4 space-y-2">
        <router-link @click="mobileOpen = false" to="/" class="block rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Accueil</router-link>
        <router-link @click="mobileOpen = false" to="/shop" class="block rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Boutique</router-link>
        <router-link @click="mobileOpen = false" to="/promotions" class="block rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Promotions</router-link>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { useThemeStore } from '@/stores/themeStore'
import { ShoppingBagIcon, MagnifyingGlassIcon, Bars3Icon, MoonIcon, SunIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const cart = useCartStore()
const theme = useThemeStore()

const searchOpen = ref(false)
const mobileOpen = ref(false)
const searchQuery = ref('')
const searchInput = ref(null)

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
</script>
