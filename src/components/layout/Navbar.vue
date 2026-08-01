<template>
  <header class="sticky top-0 z-40 bg-bg border-b-2 border-[color:var(--color-divider)]">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex flex-wrap items-center gap-x-6 gap-y-2 py-3">
        <!-- Logo -->
        <router-link to="/" class="flex-1 flex items-center gap-2 mr-2">
          <img v-if="shop.logo" :src="logoUrl" :alt="shopName" class="h-[34px] w-[34px] object-cover" />
          <div v-else class="flex h-[34px] w-[34px] items-center justify-center bg-accent-500 text-bg font-extrabold text-sm">
            O3
          </div>
          <span class="text-lg font-extrabold text-ink">{{ shopName }}</span>
        </router-link>

        <!-- Nav links -->
        <nav class="flex flex-wrap items-center gap-1">
          <router-link to="/" class="px-3 py-2 text-sm font-medium text-ink hover:text-accent-500 transition">Accueil</router-link>

          <!-- Boutique dropdown -->
          <div class="relative">
            <button type="button" @click="toggleDropdown('shop')" class="flex items-center gap-1 px-3 py-2 text-sm font-medium text-ink hover:text-accent-500 transition">
              <router-link to="/shop" @click.stop>Boutique</router-link>
              <ChevronDownIcon class="h-3.5 w-3.5" />
            </button>
            <Transition
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="opacity-0 translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-1"
            >
              <div v-if="dropdowns.shop" v-click-outside="() => closeDropdown('shop')" class="absolute left-0 top-full mt-1 w-56 bg-bg border border-[color:var(--color-divider)] shadow-[var(--shadow-md)] py-2 z-50">
                <router-link to="/shop" class="block px-4 py-2 text-sm text-ink hover:bg-neutral-100 font-medium">
                  Tous les produits
                </router-link>
                <div v-if="categoryStore.categories.length" class="border-t border-[color:var(--color-divider)] mt-1 pt-1">
                  <p class="px-4 py-1.5 text-xs font-semibold text-neutral-500 uppercase tracking-wide">Catégories</p>
                  <router-link
                    v-for="cat in categoryStore.categories"
                    :key="cat.id"
                    :to="{ name: 'shop', query: { category: cat.id } }"
                    class="flex items-center justify-between px-4 py-2 text-sm text-ink hover:bg-neutral-100 hover:text-accent-500"
                  >
                    <span>{{ cat.name }}</span>
                    <span v-if="cat.products_count != null" class="text-xs text-neutral-500">{{ cat.products_count }}</span>
                  </router-link>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Promotions dropdown -->
          <div class="relative">
            <button type="button" @click="toggleDropdown('promos')" class="flex items-center gap-1 px-3 py-2 text-sm font-medium text-ink hover:text-accent-500 transition">
              <router-link to="/promotions" @click.stop>Promotions</router-link>
              <ChevronDownIcon v-if="promoStore.promotions.length" class="h-3.5 w-3.5" />
            </button>
            <Transition
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="opacity-0 translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-1"
            >
              <div v-if="dropdowns.promos && promoStore.promotions.length" v-click-outside="() => closeDropdown('promos')" class="absolute left-0 top-full mt-1 w-56 bg-bg border border-[color:var(--color-divider)] shadow-[var(--shadow-md)] py-2 z-50">
                <router-link to="/promotions" class="block px-4 py-2 text-sm text-ink hover:bg-neutral-100 font-medium">
                  Toutes les promotions
                </router-link>
                <div class="border-t border-[color:var(--color-divider)] mt-1 pt-1">
                  <router-link
                    v-for="promo in promoStore.promotions"
                    :key="promo.id"
                    :to="{ name: 'promotion', params: { slug: promo.slug } }"
                    class="flex items-center gap-2 px-4 py-2 text-sm text-ink hover:bg-neutral-100 hover:text-accent-500"
                  >
                    <span class="tag tag-accent font-bold">
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
        <div class="flex items-center gap-1 ml-auto">
          <!-- Search toggle -->
          <button @click="searchOpen = !searchOpen" class="btn btn-icon btn-secondary border-transparent hover:border-transparent">
            <MagnifyingGlassIcon class="h-5 w-5" />
          </button>

          <!-- Cart button -->
          <button @click="cart.drawerOpen = true" class="relative btn btn-icon btn-secondary border-transparent hover:border-transparent">
            <ShoppingBagIcon class="h-5 w-5" />
            <span
              v-if="cart.totalItems > 0"
              class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center bg-accent-500 text-[10px] font-bold text-bg"
            >
              {{ cart.totalItems }}
            </span>
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
              class="input pl-11"
              ref="searchInput"
            />
            <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          </form>
        </div>
      </Transition>
    </div>
  </header>
</template>

<script setup>
import { ref, reactive, computed, inject, watch, nextTick, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { useCategoryStore } from '@/stores/categoryStore'
import { usePromoStore } from '@/stores/promoStore'
import { useImageUrl } from '@/composables/useImageUrl'
import { ShoppingBagIcon, MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()
const cart = useCartStore()
const categoryStore = useCategoryStore()
const promoStore = usePromoStore()
const { imageUrl: imgUrl } = useImageUrl()

const config = inject('shopConfig', {})
const shop = computed(() => config?.shop ?? {})
const shopName = computed(() => shop.value.name || 'Store')
const logoUrl = computed(() => shop.value.logo ? imgUrl(shop.value.logo) : null)

const searchOpen = ref(false)
const searchQuery = ref('')
const searchInput = ref(null)

const dropdowns = reactive({ shop: false, promos: false })

function toggleDropdown(key) {
  const wasOpen = dropdowns[key]
  dropdowns.shop = false
  dropdowns.promos = false
  dropdowns[key] = !wasOpen
}

function closeDropdown(key) {
  dropdowns[key] = false
}

function closeAll() {
  dropdowns.shop = false
  dropdowns.promos = false
}

const vClickOutside = {
  mounted(el, binding) {
    el.__clickOutsideHandler = (e) => {
      if (!el.contains(e.target)) binding.value(e)
    }
    document.addEventListener('click', el.__clickOutsideHandler, true)
  },
  unmounted(el) {
    document.removeEventListener('click', el.__clickOutsideHandler, true)
  },
}

// Close search + dropdowns on any route change
watch(() => route.fullPath, () => {
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
