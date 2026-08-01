<template>
  <section class="py-16">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-2xl sm:text-3xl text-ink">{{ title }}</h2>
          <p v-if="subtitle" class="mt-1 text-neutral-600">{{ subtitle }}</p>
        </div>
        <router-link :to="link" class="btn-ghost font-extrabold text-sm inline-flex items-center gap-1">
          {{ content.common.seeAll }}
          <ArrowRightIcon class="h-4 w-4" />
        </router-link>
      </div>
      <ProductGrid :products="products" />
    </div>
  </section>
</template>

<script setup>
import ProductGrid from '@/components/product/ProductGrid.vue'
import { ArrowRightIcon } from '@heroicons/vue/24/outline'
import { content } from '@/config/content'

defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  products: { type: Array, default: () => [] },
  link: { type: [String, Object], default: '/shop' },
})
</script>
