<template>
  <section class="py-16">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{{ title }}</h2>
          <p v-if="subtitle" class="mt-1 text-gray-500 dark:text-gray-400">{{ subtitle }}</p>
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="scrollLeft"
            :disabled="!canScrollLeft"
            class="hidden sm:flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeftIcon class="h-5 w-5" />
          </button>
          <button
            @click="scrollRight"
            :disabled="!canScrollRight"
            class="hidden sm:flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRightIcon class="h-5 w-5" />
          </button>
          <router-link
            :to="link"
            class="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 transition ml-2"
          >
            Voir tout
            <ArrowRightIcon class="h-4 w-4" />
          </router-link>
        </div>
      </div>

      <!-- Horizontal scroll container -->
      <div
        ref="scrollContainer"
        class="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide"
        @scroll="updateScrollState"
      >
        <div
          v-for="product in products"
          :key="product.id"
          class="flex-none w-[calc(50%-8px)] sm:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] snap-start"
        >
          <ProductCard :product="product" />
        </div>
      </div>

      <div class="mt-6 text-center sm:hidden">
        <router-link :to="link" class="text-sm font-medium text-primary-600 hover:text-primary-700">Voir tout &rarr;</router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import ProductCard from '@/components/product/ProductCard.vue'
import { ChevronLeftIcon, ChevronRightIcon, ArrowRightIcon } from '@heroicons/vue/24/outline'

defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  products: { type: Array, default: () => [] },
  link: { type: [String, Object], default: '/shop' },
})

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
  // Scroll by ~4 cards width
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
