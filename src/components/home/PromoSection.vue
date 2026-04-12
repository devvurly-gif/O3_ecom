<template>
  <section v-if="promotions.length" class="py-16 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between mb-10">
        <div class="text-center sm:text-left">
          <h2 class="text-2xl sm:text-3xl font-bold">Promotions en cours</h2>
          <p class="mt-2 text-primary-100">Profitez de nos offres exclusives</p>
        </div>
        <div class="hidden sm:flex items-center gap-2">
          <button
            @click="scrollLeft"
            :disabled="!canScrollLeft"
            class="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white hover:bg-white/10 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeftIcon class="h-5 w-5" />
          </button>
          <button
            @click="scrollRight"
            :disabled="!canScrollRight"
            class="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white hover:bg-white/10 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRightIcon class="h-5 w-5" />
          </button>
        </div>
      </div>

      <!-- Horizontal scroll container -->
      <div
        ref="scrollContainer"
        class="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide"
        @scroll="updateScrollState"
      >
        <router-link
          v-for="promo in promotions"
          :key="promo.id"
          :to="{ name: 'promotion', params: { slug: promo.slug } }"
          class="group relative flex-none w-[85%] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] snap-start rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 hover:bg-white/20 transition overflow-hidden"
        >
          <img
            v-if="promo.banner_image"
            :src="imageUrl(promo.banner_image)"
            :alt="promo.name"
            class="absolute inset-0 h-full w-full object-cover opacity-20 group-hover:opacity-30 transition"
          />
          <div class="relative">
            <span class="inline-flex items-center rounded-full bg-red-500 px-3 py-1 text-xs font-bold">
              {{ promo.type === 'percentage' ? `-${promo.value}%` : `-${promo.value} MAD` }}
            </span>
            <h3 class="mt-4 text-lg font-bold">{{ promo.name }}</h3>
            <p v-if="promo.description" class="mt-2 text-sm text-primary-100 line-clamp-2">{{ promo.description }}</p>
            <div class="mt-3 flex items-center justify-between">
              <p v-if="promo.ends_at" class="text-xs text-primary-200">
                Jusqu'au {{ new Date(promo.ends_at).toLocaleDateString('fr-FR') }}
              </p>
              <span v-if="promo.products_count" class="text-xs text-primary-200">{{ promo.products_count }} produit{{ promo.products_count > 1 ? 's' : '' }}</span>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useImageUrl } from '@/composables/useImageUrl'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

defineProps({ promotions: { type: Array, default: () => [] } })
const { imageUrl } = useImageUrl()

const scrollContainer = ref(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(true)

function updateScrollState() {
  const el = scrollContainer.value
  if (!el) return
  canScrollLeft.value = el.scrollLeft > 10
  canScrollRight.value = el.scrollLeft < el.scrollWidth - el.clientWidth - 10
}

function scrollLeft() {
  const el = scrollContainer.value
  if (!el) return
  el.scrollBy({ left: -el.clientWidth, behavior: 'smooth' })
}

function scrollRight() {
  const el = scrollContainer.value
  if (!el) return
  el.scrollBy({ left: el.clientWidth, behavior: 'smooth' })
}

onMounted(() => {
  nextTick(() => updateScrollState())
})
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
