<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
    <LoadingSpinner v-if="store.loading" />

    <template v-else-if="store.product">
      <!-- Breadcrumb -->
      <nav class="mb-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <router-link to="/" class="hover:text-primary-600 dark:hover:text-primary-400 transition">Accueil</router-link>
        <ChevronRightIcon class="h-3.5 w-3.5" />
        <router-link to="/shop" class="hover:text-primary-600 dark:hover:text-primary-400 transition">Boutique</router-link>
        <ChevronRightIcon class="h-3.5 w-3.5" />
        <span class="text-gray-900 dark:text-white font-medium truncate">{{ store.product.title }}</span>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <!-- Images -->
        <div>
          <div class="aspect-square rounded-2xl bg-gray-50 dark:bg-gray-800 overflow-hidden cursor-zoom-in" @click="openLightbox(selectedImage)">
            <img
              :src="imageUrl(currentImage)"
              :alt="store.product.title"
              class="h-full w-full object-cover"
            />
          </div>
          <div v-if="images.length > 1" class="mt-4 grid grid-cols-5 gap-3">
            <button
              v-for="(img, i) in images"
              :key="i"
              @click="selectedImage = i"
              :class="[
                'aspect-square rounded-xl overflow-hidden border-2 transition',
                selectedImage === i ? 'border-primary-500' : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
              ]"
            >
              <img :src="imageUrl(img)" class="h-full w-full object-cover" />
            </button>
          </div>
        </div>

        <!-- Details -->
        <div>
          <p v-if="store.product.category" class="mb-2 text-sm font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wide">{{ store.product.category.name }}</p>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{{ store.product.title }}</h1>

          <!-- Price -->
          <div class="mt-4 flex items-baseline gap-3">
            <span class="text-3xl font-bold text-gray-900 dark:text-white">{{ formatPrice(effectivePrice) }}</span>
            <span v-if="store.product.has_promo" class="text-lg text-gray-400 dark:text-gray-500 line-through">{{ formatPrice(store.product.price_ttc) }}</span>
            <span v-if="store.product.has_promo" class="rounded-full bg-red-100 dark:bg-red-900/30 px-3 py-1 text-xs font-bold text-red-600 dark:text-red-400">
              -{{ store.product.discount_percent }}%
            </span>
          </div>

          <!-- Description -->
          <p v-if="store.product.description" class="mt-6 text-gray-600 dark:text-gray-300 leading-relaxed">{{ store.product.description }}</p>

          <!-- Stock -->
          <div class="mt-4">
            <span v-if="store.product.in_stock" class="inline-flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400 font-medium">
              <span class="h-2 w-2 rounded-full bg-green-500"></span> En stock
            </span>
            <span v-else class="inline-flex items-center gap-1.5 text-sm text-red-500 dark:text-red-400 font-medium">
              <span class="h-2 w-2 rounded-full bg-red-500"></span> Rupture de stock
            </span>
          </div>

          <!-- Add to cart -->
          <div class="mt-8 flex items-center gap-4">
            <div class="flex items-center rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <button @click="qty > 1 && qty--" class="px-4 py-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition">-</button>
              <span class="w-10 text-center font-semibold text-gray-900 dark:text-white">{{ qty }}</span>
              <button @click="qty++" class="px-4 py-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition">+</button>
            </div>
            <button
              @click="addToCart"
              :disabled="!store.product.in_stock"
              :class="[
                'flex-1 rounded-xl px-8 py-3.5 text-sm font-semibold text-white transition active:scale-[0.98]',
                store.product.in_stock ? 'bg-primary-600 hover:bg-primary-700' : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
              ]"
            >
              {{ store.product.in_stock ? 'Ajouter au panier' : 'Indisponible' }}
            </button>
          </div>

          <!-- Meta -->
          <div class="mt-8 divide-y divide-gray-100 dark:divide-gray-800 text-sm">
            <div v-if="store.product.sku" class="flex justify-between py-3">
              <span class="text-gray-500 dark:text-gray-400">SKU</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ store.product.sku }}</span>
            </div>
            <div v-if="store.product.brand" class="flex justify-between py-3">
              <span class="text-gray-500 dark:text-gray-400">Marque</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ store.product.brand.name }}</span>
            </div>
          </div>

          <!-- Long description -->
          <div v-if="store.product.long_description" class="mt-8 prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300" v-html="store.product.long_description"></div>
        </div>
      </div>
    </template>

    <div v-else class="py-20 text-center">
      <p class="text-gray-500 dark:text-gray-400">Produit introuvable</p>
      <router-link to="/shop" class="mt-4 inline-block text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700">Retour a la boutique</router-link>
    </div>

    <!-- Fullscreen Lightbox -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="lightboxOpen" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90" @click.self="lightboxOpen = false">
          <!-- Close button -->
          <button @click="lightboxOpen = false" class="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition">
            <XMarkIcon class="h-6 w-6" />
          </button>

          <!-- Counter -->
          <div v-if="images.length > 1" class="absolute top-4 left-4 rounded-full bg-white/10 px-3 py-1 text-sm text-white">
            {{ lightboxIndex + 1 }} / {{ images.length }}
          </div>

          <!-- Prev button -->
          <button v-if="images.length > 1" @click.stop="prevImage" class="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition">
            <ChevronLeftIcon class="h-6 w-6" />
          </button>

          <!-- Image -->
          <img
            :src="imageUrl(images[lightboxIndex])"
            :alt="store.product?.title"
            class="max-h-[90vh] max-w-[90vw] object-contain select-none"
            @click.stop
          />

          <!-- Next button -->
          <button v-if="images.length > 1" @click.stop="nextImage" class="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition">
            <ChevronRightIconSolid class="h-6 w-6" />
          </button>

          <!-- Thumbnails -->
          <div v-if="images.length > 1" class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            <button
              v-for="(img, i) in images"
              :key="i"
              @click.stop="lightboxIndex = i"
              :class="[
                'h-16 w-16 rounded-lg overflow-hidden border-2 transition',
                lightboxIndex === i ? 'border-white' : 'border-transparent opacity-50 hover:opacity-80'
              ]"
            >
              <img :src="imageUrl(img)" class="h-full w-full object-cover" />
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useProductStore } from '@/stores/productStore'
import { useCartStore } from '@/stores/cartStore'
import { useFormatPrice } from '@/composables/useFormatPrice'
import { useImageUrl } from '@/composables/useImageUrl'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/vue/20/solid'
import { ChevronRightIcon as ChevronRightIconSolid } from '@heroicons/vue/20/solid'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({ slug: { type: String, required: true } })

const store = useProductStore()
const cart = useCartStore()
const { formatPrice } = useFormatPrice()
const { imageUrl } = useImageUrl()

const qty = ref(1)
const selectedImage = ref(0)
const lightboxOpen = ref(false)
const lightboxIndex = ref(0)

const images = computed(() => {
  if (!store.product?.images?.length) return [store.product?.image ?? null]
  return store.product.images.map(img => typeof img === 'string' ? img : img.url)
})

const currentImage = computed(() => images.value[selectedImage.value] ?? null)

const effectivePrice = computed(() =>
  store.product?.has_promo ? store.product.promo_price_ttc : store.product?.price_ttc
)

function openLightbox(index) {
  lightboxIndex.value = index
  lightboxOpen.value = true
}

function nextImage() {
  lightboxIndex.value = (lightboxIndex.value + 1) % images.value.length
}

function prevImage() {
  lightboxIndex.value = (lightboxIndex.value - 1 + images.value.length) % images.value.length
}

function handleKeydown(e) {
  if (!lightboxOpen.value) return
  if (e.key === 'Escape') lightboxOpen.value = false
  if (e.key === 'ArrowRight') nextImage()
  if (e.key === 'ArrowLeft') prevImage()
}

function addToCart() {
  if (!store.product?.in_stock) return
  cart.addItem(store.product, qty.value)
  qty.value = 1
}

onMounted(() => {
  store.fetchProduct(props.slug)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

watch(() => props.slug, (s) => {
  selectedImage.value = 0
  qty.value = 1
  store.fetchProduct(s)
})
</script>
