<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
    <LoadingSpinner v-if="store.loading" />

    <template v-else-if="store.product">
      <nav class="mb-6 flex items-center gap-2 text-sm text-neutral-600">
        <router-link to="/" class="hover:text-accent-500 transition">Accueil</router-link>
        <ChevronRightIcon class="h-3.5 w-3.5" />
        <router-link to="/shop" class="hover:text-accent-500 transition">Boutique</router-link>
        <ChevronRightIcon class="h-3.5 w-3.5" />
        <span class="text-ink font-bold truncate">{{ store.product.title }}</span>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <!-- Images -->
        <div>
          <div class="aspect-square bg-surface overflow-hidden cursor-zoom-in" @click="openLightbox(selectedImage)">
            <img :src="imageUrl(currentImage)" :alt="store.product.title" width="800" height="800" fetchpriority="high" decoding="async" class="h-full w-full object-cover" />
          </div>
          <div v-if="images.length > 1" class="mt-4 grid grid-cols-5 gap-3">
            <button v-for="(img, i) in images" :key="i" @click="selectedImage = i"
              :class="['aspect-square overflow-hidden border-2 transition', selectedImage === i ? 'border-accent-500' : 'border-transparent hover:border-neutral-400']">
              <img :src="imageUrl(img)" alt="" width="160" height="160" loading="lazy" decoding="async" class="h-full w-full object-cover" />
            </button>
          </div>
        </div>

        <!-- Details -->
        <div>
          <p v-if="store.product.category" class="mb-2 text-xs font-extrabold text-accent-700 uppercase tracking-wide">{{ store.product.category.name }}</p>
          <h1 class="text-2xl sm:text-3xl text-ink">{{ store.product.title }}</h1>

          <!-- Price -->
          <div v-if="prixConnu" class="mt-4 flex items-baseline gap-3">
            <span class="text-[28px] font-extrabold text-ink">{{ formatPrice(prixApplique) }}</span>
            <span v-if="store.product.has_promo && !selectedVariant" class="text-lg text-neutral-500 line-through">{{ formatPrice(store.product.price_ttc) }}</span>
            <span v-if="store.product.has_promo && !selectedVariant" class="tag tag-accent">-{{ store.product.discount_percent }}%</span>
          </div>

          <!-- Prix non saisi dans l'ERP : on propose le contact plutôt qu'un
               « 0,00 MAD » trompeur et un panier qu'on ne saurait pas facturer. -->
          <div v-else class="mt-4 border border-divider bg-surface p-4">
            <p class="text-[22px] font-extrabold text-ink">{{ content.price.onRequest }}</p>
            <p class="mt-1 text-sm text-neutral-600">{{ content.price.cardHint }}</p>
            <a v-if="lienContact" :href="lienContact" class="btn btn-primary mt-3 inline-flex">
              {{ content.price.contactCta }}
            </a>
          </div>

          <!-- Variant selector -->
          <div v-if="store.product.has_variants && store.product.variants && store.product.variants.length" class="mt-6">
            <p class="text-sm font-bold text-ink mb-3">
              Variante
              <span v-if="selectedVariant" class="ml-2 font-normal text-accent-500">— {{ selectedVariant.label }}</span>
            </p>
            <div class="flex flex-wrap gap-2">
              <button v-for="v in store.product.variants" :key="v.id"
                @click="selectVariant(v)"
                :disabled="!v.in_stock"
                :class="[
                  'btn',
                  selectedVariant && selectedVariant.id === v.id
                    ? 'btn-primary'
                    : v.in_stock
                      ? 'btn-secondary'
                      : 'btn-secondary opacity-45 line-through cursor-not-allowed'
                ]">
                {{ v.label }}<span v-if="!v.in_stock" class="ml-1 text-xs">(épuisé)</span>
              </button>
            </div>
            <p v-if="selectedVariant" class="mt-2 text-xs text-neutral-500">Stock : {{ selectedVariant.stock_available }} pcs</p>
            <p v-else class="mt-2 text-xs text-accent-700">Choisissez une variante pour ajouter au panier.</p>
          </div>

          <!-- Description -->
          <div v-if="store.product.long_description" class="mt-6 prose prose-sm max-w-none" v-html="store.product.long_description"></div>
          <p v-else-if="store.product.description" class="mt-6 text-neutral-700 leading-relaxed">{{ store.product.description }}</p>

          <!-- Stock -->
          <div class="mt-4">
            <span v-if="currentInStock" class="inline-flex items-center gap-2 text-sm text-ink font-medium">
              <span class="h-1.5 w-1.5 bg-accent-500"></span> En stock
            </span>
            <span v-else class="text-sm text-neutral-500 font-medium">
              Rupture de stock
            </span>
          </div>

          <!-- Add to cart -->
          <div class="mt-8 flex items-center gap-4">
            <div class="flex items-center border border-divider">
              <button @click="qty > 1 && qty--" class="px-4 py-3 text-neutral-600 hover:text-ink transition">-</button>
              <span class="w-10 text-center font-bold text-ink">{{ qty }}</span>
              <button @click="qty++" class="px-4 py-3 text-neutral-600 hover:text-ink transition">+</button>
            </div>
            <button @click="addToCart" :disabled="!canAddToCart"
              :class="['btn flex-1', canAddToCart ? 'btn-primary' : 'btn-secondary opacity-45 cursor-not-allowed']">
              {{ addToCartLabel }}
            </button>
          </div>

          <!-- Meta -->
          <div class="mt-8 text-sm">
            <div v-if="currentSku" class="flex justify-between py-3 border-t border-divider">
              <span class="text-neutral-600">SKU</span>
              <span class="font-medium text-ink">{{ currentSku }}</span>
            </div>
            <div v-if="store.product.brand" class="flex justify-between py-3 border-t border-divider">
              <span class="text-neutral-600">Marque</span>
              <span class="font-medium text-ink">{{ store.product.brand.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Videos -->
      <div v-if="videos.length" class="mt-12">
        <h2 class="text-lg mb-4 text-ink">Vidéos</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            v-for="video in videos"
            :key="video.id"
            type="button"
            class="group relative aspect-video overflow-hidden bg-neutral-900 text-left border border-divider"
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
        <h2 class="text-lg mb-4 text-ink">Documents</h2>
        <div class="border border-divider">
          <a
            v-for="doc in documents"
            :key="doc.id"
            :href="fileUrl(doc.url)"
            target="_blank"
            rel="noopener"
            class="flex items-center gap-3 px-4 py-3 bg-bg hover:bg-neutral-100 transition border-t border-divider first:border-t-0"
          >
            <DocumentArrowDownIcon class="h-6 w-6 flex-shrink-0 text-accent-500" />
            <span class="flex-1 min-w-0 truncate text-sm font-medium text-ink">
              {{ doc.title || doc.file_name }}
            </span>
            <span v-if="doc.size" class="flex-shrink-0 text-xs text-neutral-500">
              {{ fileSize(doc.size) }}
            </span>
          </a>
        </div>
      </div>
    </template>

    <div v-else-if="!store.loading" class="py-20 text-center">
      <p class="text-lg font-bold text-ink">Produit introuvable</p>
      <router-link to="/shop" class="btn btn-primary mt-6 inline-flex">Retour à la boutique</router-link>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="lightboxOpen" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90" @click.self="lightboxOpen = false">
          <button @click="lightboxOpen = false" class="absolute top-4 right-4 bg-white/10 p-2 text-white hover:bg-white/20"><XMarkIcon class="h-6 w-6" /></button>
          <button v-if="images.length > 1" @click.stop="prevImage" class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 p-3 text-white hover:bg-white/20"><ChevronLeftIcon class="h-6 w-6" /></button>
          <img :src="imageUrl(images[lightboxIndex])" :alt="store.product && store.product.title" class="max-h-[90vh] max-w-[90vw] object-contain select-none" @click.stop />
          <button v-if="images.length > 1" @click.stop="nextImage" class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 p-3 text-white hover:bg-white/20"><ChevronRightIconSolid class="h-6 w-6" /></button>
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
          <button @click="closeVideo" class="absolute top-4 right-4 z-10 bg-white/10 p-2 text-white hover:bg-white/20 transition">
            <XMarkIcon class="h-6 w-6" />
          </button>
          <div class="w-full max-w-4xl aspect-video">
            <iframe
              v-if="activeVideoEmbedUrl"
              :src="activeVideoEmbedUrl"
              class="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
            <div v-else class="flex h-full w-full flex-col items-center justify-center gap-4 bg-neutral-900 text-center px-6">
              <p class="text-white">Cette vidéo ne peut pas être lue ici.</p>
              <a
                :href="activeVideo.url"
                target="_blank"
                rel="noopener"
                class="btn btn-primary"
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
import { content } from '@/config/content'
import { useFormatPrice } from '@/composables/useFormatPrice'
import { useShopContact } from '@/composables/useShopContact'
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
const { formatPrice, effectivePrice, isPurchasable } = useFormatPrice()
const { demandeDePrix } = useShopContact()
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

const prixApplique = computed(() => effectivePrice(store.product, selectedVariant.value))
const prixConnu = computed(() => isPurchasable(store.product, selectedVariant.value))

// WhatsApp avec le nom du produit pré-rempli, sinon téléphone, sinon e-mail ;
// null si la boutique n'a rien renseigné, pour ne pas afficher un bouton mort.
const lienContact = computed(() =>
  store.product ? demandeDePrix(store.product.title) : null
)

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
  if (!prixConnu.value) return false
  if (!currentInStock.value) return false
  if (store.product && store.product.has_variants && !selectedVariant.value) return false
  return true
})

const addToCartLabel = computed(() => {
  if (!prixConnu.value) return content.price.cartBlocked
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
