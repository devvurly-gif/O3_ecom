<template>
  <aside class="space-y-6">
    <!-- Categories -->
    <div>
      <h3 class="mb-3 text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Categories</h3>
      <ul class="space-y-1">
        <li>
          <button
            @click="$emit('filterCategory', null)"
            :class="[
              'w-full text-left rounded-lg px-3 py-2 text-sm transition',
              !selectedCategory ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
            ]"
          >
            Toutes les categories
          </button>
        </li>
        <li v-for="cat in categories" :key="cat.id">
          <button
            @click="$emit('filterCategory', cat.id)"
            :class="[
              'w-full text-left rounded-lg px-3 py-2 text-sm transition flex justify-between items-center',
              selectedCategory === cat.id ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
            ]"
          >
            <span>{{ cat.name }}</span>
            <span v-if="cat.products_count != null" class="text-xs text-gray-400 dark:text-gray-500">{{ cat.products_count }}</span>
          </button>
        </li>
      </ul>
    </div>

    <!-- Sort -->
    <div>
      <h3 class="mb-3 text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Trier par</h3>
      <select
        :value="sortBy"
        @change="$emit('sort', $event.target.value)"
        class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
      >
        <option value="">Par defaut</option>
        <option value="newest">Plus recents</option>
        <option value="price_asc">Prix croissant</option>
        <option value="price_desc">Prix decroissant</option>
        <option value="name">Nom A-Z</option>
      </select>
    </div>
  </aside>
</template>

<script setup>
defineProps({
  categories: { type: Array, default: () => [] },
  selectedCategory: { type: [Number, null], default: null },
  sortBy: { type: String, default: '' },
})

defineEmits(['filterCategory', 'sort'])
</script>
