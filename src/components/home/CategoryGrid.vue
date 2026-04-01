<template>
  <section class="py-16 bg-gray-50 dark:bg-gray-900/50">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-10">
        <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Nos Categories</h2>
        <p class="mt-2 text-gray-500 dark:text-gray-400">Explorez nos differentes categories de produits</p>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <router-link
          v-for="cat in categories"
          :key="cat.id"
          :to="{ name: 'shop', query: { category: cat.id } }"
          class="group relative flex flex-col items-center rounded-2xl bg-white dark:bg-gray-800 p-6 border border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-700 hover:shadow-md transition"
        >
          <div class="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 transition">
            <TagIcon class="h-7 w-7" />
          </div>
          <h3 class="mt-4 text-sm font-semibold text-gray-900 dark:text-white text-center">{{ cat.name }}</h3>
          <p v-if="cat.products_count != null" class="mt-1 text-xs text-gray-400 dark:text-gray-500">{{ cat.products_count }} produits</p>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { TagIcon } from '@heroicons/vue/24/outline'

defineProps({ categories: { type: Array, default: () => [] } })
</script>
