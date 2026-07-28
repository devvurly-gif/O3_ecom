<template>
  <section class="py-16 bg-surface">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-10">
        <h2 class="text-2xl sm:text-3xl text-ink">Nos Categories</h2>
        <p class="mt-2 text-neutral-600">Explorez nos differentes categories de produits</p>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <router-link
          v-for="cat in categories"
          :key="cat.id"
          :to="{ name: 'shop', query: { category: cat.id } }"
          class="group flex flex-col items-center border border-divider p-6 hover:bg-neutral-100 transition"
        >
          <div class="flex h-14 w-14 items-center justify-center bg-accent-100 text-accent-500">
            <TagIcon class="h-7 w-7" />
          </div>
          <h3 class="mt-4 text-sm font-extrabold text-ink text-center">{{ cat.name }}</h3>
          <p v-if="cat.products_count != null" class="mt-1 text-xs text-neutral-500">{{ cat.products_count }} produits</p>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { TagIcon } from '@heroicons/vue/24/outline'

defineProps({ categories: { type: Array, default: () => [] } })
</script>
