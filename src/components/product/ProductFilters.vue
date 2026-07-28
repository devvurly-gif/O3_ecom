<template>
  <aside class="space-y-6">
    <!-- Categories -->
    <div>
      <h3 class="mb-3 text-sm font-extrabold text-ink uppercase tracking-wider">Categories</h3>
      <ul class="space-y-1">
        <li>
          <button
            @click="$emit('filterCategory', null)"
            class="w-full text-left px-3 py-2 text-sm transition flex items-center gap-2"
            :class="!selectedCategory ? 'text-accent-700 font-bold' : 'text-neutral-600 hover:bg-neutral-100'"
          >
            <span class="h-1.5 w-1.5 bg-accent-500 shrink-0" :class="!selectedCategory ? 'opacity-100' : 'opacity-0'"></span>
            Toutes les categories
          </button>
        </li>
        <li v-for="cat in categories" :key="cat.id">
          <button
            @click="$emit('filterCategory', cat.id)"
            class="w-full text-left px-3 py-2 text-sm transition flex items-center gap-2"
            :class="selectedCategory === cat.id ? 'text-accent-700 font-bold' : 'text-neutral-600 hover:bg-neutral-100'"
          >
            <span class="h-1.5 w-1.5 bg-accent-500 shrink-0" :class="selectedCategory === cat.id ? 'opacity-100' : 'opacity-0'"></span>
            <span class="flex-1">{{ cat.name }}</span>
            <span v-if="cat.products_count != null" class="text-xs text-neutral-500">{{ cat.products_count }}</span>
          </button>
        </li>
      </ul>
    </div>

    <!-- Sort -->
    <div>
      <h3 class="mb-3 text-sm font-extrabold text-ink uppercase tracking-wider">Trier par</h3>
      <select
        :value="sortBy"
        @change="$emit('sort', $event.target.value)"
        class="input"
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
