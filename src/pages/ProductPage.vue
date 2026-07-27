<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
    <LoadingSpinner v-if="store.loading" />

    <template v-else-if="store.product">
      <nav class="mb-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <router-link to="/" class="hover:text-primary-600 transition">Accueil</router-link>
        <ChevronRightIcon class="h-3.5 w-3.5" />
        <router-link to="/shop" class="hover:text-primary-600 transition">Boutique</router-link>
        <ChevronRightIcon class="h-3.5 w-3.5" />
        <span class="text-gray-900 dark:text-white font-medium truncate">{{ store.product.title }}</span>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <!-- Images -->
        <div>
          <div class="aspect-square rounded-2xl bg-gray-50 dark:bg-gray-800 overflow-hidden cursor-zoom-in" @click="openLightbox(selectedImage)">
            <img :src="imageUrl(currentImage)" :alt="store.product.title" class="h-full w-full object-cover" />
          </div>
          <div v-if="images.length > 1" class="mt-4 grid grid-cols-5 gap-3">
            <button v-for="(img, i) in images" :key="i" @click="selectedImage = i"
              :class="['aspect-square rounded-xl overflow-hidden border-2 transition', selectedImage === i ? 'border-primary-500' : 'border-transparent hover:border-gray-300']">
              <img :src="imageUrl(img)" class="h-full w-full object-cover" />
            </button>
          </div>
        </div>

        <!-- Details -->
        <div>
          <p v-if="store.product.category" class="mb-2 text-sm font-medium text-primary-600 uppercase tracking-wide">{{ store.product.category.name }}</p>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{{ store.product.title }}</h1>

          <!-- Price -->
          <div class="mt-4 flex items-baseline gap-3">
            <span class="text-3xl font-bold text-gray-900 dark:text-white">{{ formatPrice(effectivePrice) }}</span>
            <span v-if="store.product.has_promo && !selectedVariant" class="text-lg text-gray-400 line-through">{{ formatPrice(store.product.price_ttc) }}</span>
            <span v-if="store.product.has_promo && !selectedVariant" class="rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">-{{ store.product.discount_percent }}%</span>
          </div>

          <!-- Variant selector -->
          <div v-if="store.product.has_variants && store.product.variants && store.product.variants.length" class="mt-6">
            <p class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Variante
              <span v-if="selectedVariant" class="ml-2 font-normal text-primary-600">— {{ selectedVariant.label }}</span>
            </p>
            <div class="flex flex-wrap gap-2">
              <button v-for="v in store.product.variants" :key="v.id"
                @click="selectVariant(v)"
                :disabled="!v.in_stock"
                :class="[
                  'px-4 py-2 rounded-lg border-2 text-sm font-medium transition',
                  selectedVariant && selectedVariant.id === v.id
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700'
                    : v.in_stock
                      ? 'border-gray-200 dark:border-gray-600 hover:border-primary-400 text-gray-700 dark:text-gray-300'
                      : 'border-gray-100 dark:border-gray-700 text-gray-300 cursor-not-allowed line-through'
                ]">
                {{ v.label }}<span v-if="!v.in_stock" class="ml-1 text-xs">(epuise)</span>
              </button>
            </div>
            <p v-if="selectedVariant" class="mt-2 text-xs text-gray-400">Stock : {{ selectedVariant.stock_available }} pcs</p>
            <p v-else class="mt-2 text-xs text-orange-500">Choisissez une variante pour ajouter au panier.</p>
          </div>

          <!-- Description -->
          <div v-if="store.product.long_description" class="mt-6 prose prose-sm dark:prose-invert max-w-none" v-html="store.product.long_description"></div>
          <p v-else-if="store.product.description" class="mt-6 text-gray-600 dark:text-gray-300 leading-relaxed">{{ store.product.description }}</p>

          <!-- Stock -->
          <div class="mt-4">
            <span v-if="currentInStock" class="inline-flex items-center gap-1.5 text-sm text-green-600 font-medium">
              <span class="h-2 w-2 rounded-full bg-green-500"></span> En stock
            </span>
            <span v-else class="inline-flex items-center gap-1.5 text-sm text-red-500 font-medium">
              <span class="h-2 w-2 rounded-full bg-red-500"></span> Rupture de stock
            </span>
          </div>

          <!-- Add to cart -->
          <div class="mt-8 flex items-center gap-4">
            <div class="flex items-center rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <button @click="qty > 1 && qty--" class="px-4 py-3 text-gray-500 hover:text-gray-700 transition">-</button>
              <span class="w-10 text-center font-semibold text-gray-900 dark:text-white">{{ qty }}</span>
              <button @click="qty++" class="px-4 py-3 text-gray-500 hover:text-gray-700 transition">+</button>
            </div>
            <button @click="addToCart" :disabled="!canAddToCart"
              :class="['flex-1 rounded-xl px-8 py-3.5 text-sm font-semibold text-white transition active:scale-[0.98]', canAddToCart ? 'bg-primary-600 hover:bg-primary-700' : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed']">
              {{ addToCartLabel }}
            </button>
          </div>

          <!-- Meta -->
          <div class="mt-8 divide-y divide-gray-100 dark:divide-gray-800 text-sm">
            <div v-if="currentSku" class="flex justify-between py-3">
              <span class="text-gray-500">SKU</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ currentSku }}</span>
            </div>
            <div v-if="store.product.brand" class="flex justify-between py-3">
              <span class="text-gray-500">Marque</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ store.product.brand.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Videos -->
      <div v-if="videos.length" class="mt-12">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Vidéos</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            v-for="video in videos"
            :key="video.id"
            type="button"
            class="group relative aspect-video rounded-2xl overflow-hidden bg-gray-900 text-left"
            @click="openVideo(video)"
          >
            <img
              v-if="thumbnailUrl(video.url)"
              :src="thumbnailUrl(video.url)"
              :alt="video.title || 'Vidéo'"
              class="h-full w-full object-cover opacity-80 group-hover:opacity-60 transition"
            />
            <div class="absolute inset-0 flex items-center justify-center">
              <PlayCircleIcon class="h-14 w-14 text-white drop-shadow-lg group-hover:scale-110 transition" />
            </div>
            <p v-if="video.title" class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2 text-sm font-medium text-white truncate">
              {{ video.title }}
            </p>
          </button>
        </div>
      </div>

      <!-- Documents -->
      <div v-if="documents.length" class="mt-12">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Documents</h2>
        <div class="divide-y divide-gray-100 dark:divide-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <a
            v-for="doc in documents"
            :key="doc.id"
            :href="fileUrl(doc.url)"
            target="_blank"
            rel="noopener"
            class="flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
          >
            <DocumentArrowDownIcon class="h-6 w-6 flex-shrink-0 text-primary-600 dark:text-primary-400" />
            <span class="flex-1 min-w-0 truncate text-sm font-medium text-gray-900 dark:text-white">
              {{ doc.title || doc.file_name }}
            </span>
            <span v-if="doc.size" class="flex-shrink-0 text-xs text-gray-400 dark:text-gray-500">
              {{ fileSize(doc.size) }}
            </span>
          </a>
        </div>
      </div>
    </template>

    <div v-else-if="!store.loading" class="py-20 text-center">
      <p class="text-lg font-semibold text-gray-900 dark:text-white">Produit introuvable</p>
      <router-link to="/shop" class="mt-6 inline-block rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 transition">Retour a la boutique</router-link>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="lightboxOpen" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90" @click.self="lightboxOpen = false">
          <button @click="lightboxOpen = false" class="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"><XMarkIcon class="h-6 w-6" /></button>
          <button v-if="images.length > 1" @click.stop="prevImage" class="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"><ChevronLeftIcon class="h-6 w-6" /></button>
          <img :src="imageUrl(images[lightboxIndex])" :alt="store.product && store.product.title" class="max-h-[90vh] max-w-[90vw] object-contain select-none" @click.stop />
          <button v-if="images.length > 1" @click.stop="nextImage" class="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"><ChevronRightIconSolid class="h-6 w-6" /></button>
        </div>
      </Transition>
    </Teleport>

    <!-- Video Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="activeVideo" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4" @click.self="closeVideo">
          <button @click="closeVideo" class="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition">
            <XMarkIcon class="h-6 w-6" />
          </button>
          <div class="w-full max-w-4xl aspect-video">
            <iframe
              v-if="activeVideoEmbedUrl"
              :src="activeVideoEmbedUrl"
              class="h-full w-full rounded-xl"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
            <div v-else class="flex h-full w-full flex-col items-center justify-center gap-4 rounded-xl bg-gray-900 text-center px-6">
              <p class="text-white">Cette vidéo ne peut pas être lue ici.</p>
              <a
                :href="activeVideo.url"
                target="_blank"
                rel="noopener"
                class="rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 transition"
              >
                Ouvrir la vidéo
              </a>
            </div>
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
import { useFileUrl } from '@/composables/useFileUrl'
import { useVideoEmbed } from '@/composables/useVideoEmbed'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/vue/20/solid'
import { ChevronRightIcon as ChevronRightIconSolid } from '@heroicons/vue/20/solid'
import { XMarkIcon, PlayCircleIcon, DocumentArrowDownIcon } from '@heroicons/vue/24/outline'

const props = defineProps({ slug: { type: String, required: true } })

const store = useProductStore()
const cart = useCartStore()
const { formatPrice } = useFormatPrice()
const { imageUrl } = useImageUrl()
const { fileUrl, fileSize } = useFileUrl()
const { embedUrl, thumbnailUrl } = useVideoEmbed()

const qty = ref(1)
const selectedImage = ref(0)
const lightboxOpen = ref(false)
const lightboxIndex = ref(0)
const activeVideo = ref(null)
const selectedVariant = ref(null)

const images = computed(() => {
  if (!store.product || !store.product.images || !store.product.images.length) {
    return [store.product ? store.product.image : null]
  }
  return store.product.images.map(img => typeof img === 'string' ? img : img.url)
})

const currentImage = computed(() => images.value[selectedImage.value] || null)

const videos = computed(() => store.product?.videos ?? [])
const documents = computed(() => store.product?.documents ?? [])
const activeVideoEmbedUrl = computed(() => activeVideo.value ? embedUrl(activeVideo.value.url) : null)

const effectivePrice = computed(() => {
  if (selectedVariant.value) return selectedVariant.value.price_ttc
  if (!store.product) return 0
  return store.product.has_promo ? store.product.promo_price_ttc : store.product.price_ttc
})

const currentInStock = computed(() => {
  if (store.product && store.product.has_variants) {
    return selectedVariant.value ? selectedVariant.value.in_stock : false
  }
  return store.product ? store.product.in_stock : false
})

const currentSku = computed(() => {
  return (selectedVariant.value ? selectedVariant.value.sku : null) || (store.product ? store.product.sku : null)
})

const canAddToCart = computed(() => {
  if (!currentInStock.value) return false
  if (store.product && store.product.has_variants && !selectedVariant.value) return false
  return true
})

const addToCartLabel = computed(() => {
  if (!currentInStock.value) return 'Indisponible'
  if (store.product && store.product.has_variants && !selectedVariant.value) return 'Choisir une variante'
  return 'Ajouter au panier'
})

function selectVariant(v) {
  selectedVariant.value = selectedVariant.value && selectedVariant.value.id === v.id ? null : v
}

function addToCart() {
  if (!canAddToCart.value || !store.product) return
  cart.addItem(store.product, qty.value, selectedVariant.value)
  qty.value = 1
}

function openLightbox(index) { lightboxIndex.value = index; lightboxOpen.value = true }
function nextImage() { lightboxIndex.value = (lightboxIndex.value + 1) % images.value.length }
function prevImage() { lightboxIndex.value = (lightboxIndex.value - 1 + images.value.length) % images.value.length }

function openVideo(video) {
  activeVideo.value = video
}

function closeVideo() {
  activeVideo.value = null
}

function handleKeydown(e) {
  if (activeVideo.value) {
    if (e.key === 'Escape') closeVideo()
    return
  }
  if (!lightboxOpen.value) return
  if (e.key === 'Escape') lightboxOpen.value = false
  if (e.key === 'ArrowRight') nextImage()
  if (e.key === 'ArrowLeft') prevImage()
}

onMounted(() => {
  store.fetchProduct(props.slug)
  document.addEventListener('keydown', handleKeydown)
})
onUnmounted(() => document.removeEventListener('keydown', handleKeydown))
watch(() => props.slug, (s) => {
  selectedImage.value = 0
  selectedVariant.value = null
  qty.value = 1
  store.fetchProduct(s)
})
</script>
