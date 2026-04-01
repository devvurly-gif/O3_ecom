<template>
  <section class="py-16">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{{ title }}</h2>
          <p v-if="subtitle" class="mt-1 text-gray-500 dark:text-gray-400">{{ subtitle }}</p>
        </div>
        <router-link :to="link" class="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 transition">
          Voir tout
          <ArrowRightIcon class="h-4 w-4" />
        </router-link>
      </div>
      <ProductGrid :products="products" />
      <div class="mt-6 text-center sm:hidden">
        <router-link :to="link" class="text-sm font-medium text-primary-600 hover:text-primary-700">Voir tout &rarr;</router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import ProductGrid from '@/components/product/ProductGrid.vue'
import { ArrowRightIcon } from '@heroicons/vue/24/outline'

defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  products: { type: Array, default: () => [] },
  link: { type: [String, Object], default: '/shop' },
})
</script>
