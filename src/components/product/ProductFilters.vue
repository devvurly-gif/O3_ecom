<template>
  <aside class="space-y-8">
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

    <!-- Brands -->
    <div v-if="brands.length">
      <h3 class="mb-3 text-sm font-extrabold text-ink uppercase tracking-wider">Marques</h3>
      <ul class="space-y-1">
        <li>
          <button
            @click="$emit('filterBrand', null)"
            class="w-full text-left px-3 py-2 text-sm transition flex items-center gap-2"
            :class="!selectedBrand ? 'text-accent-700 font-bold' : 'text-neutral-600 hover:bg-neutral-100'"
          >
            <span class="h-1.5 w-1.5 bg-accent-500 shrink-0" :class="!selectedBrand ? 'opacity-100' : 'opacity-0'"></span>
            Toutes les marques
          </button>
        </li>
        <li v-for="brand in brands" :key="brand.id">
          <button
            @click="$emit('filterBrand', brand.id)"
            class="w-full text-left px-3 py-2 text-sm transition flex items-center gap-2"
            :class="selectedBrand === brand.id ? 'text-accent-700 font-bold' : 'text-neutral-600 hover:bg-neutral-100'"
          >
            <span class="h-1.5 w-1.5 bg-accent-500 shrink-0" :class="selectedBrand === brand.id ? 'opacity-100' : 'opacity-0'"></span>
            <span class="flex-1">{{ brand.name }}</span>
            <span v-if="brand.products_count != null" class="text-xs text-neutral-500">{{ brand.products_count }}</span>
          </button>
        </li>
      </ul>
    </div>

    <!-- Price range -->
    <div>
      <h3 class="mb-3 text-sm font-extrabold text-ink uppercase tracking-wider">Prix (MAD)</h3>
      <form @submit.prevent="applyPrice" class="space-y-3">
        <div class="flex items-center gap-2">
          <div class="field flex-1">
            <label>Min</label>
            <input v-model.number="priceMinInput" type="number" min="0" inputmode="numeric" class="input" placeholder="0" />
          </div>
          <div class="field flex-1">
            <label>Max</label>
            <input v-model.number="priceMaxInput" type="number" min="0" inputmode="numeric" class="input" placeholder="—" />
          </div>
        </div>
        <button type="submit" class="btn btn-secondary btn-block">Appliquer</button>
      </form>
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
import { ref, watch } from 'vue'

const props = defineProps({
  categories: { type: Array, default: () => [] },
  selectedCategory: { type: [Number, null], default: null },
  brands: { type: Array, default: () => [] },
  selectedBrand: { type: [Number, null], default: null },
  priceMin: { type: [Number, null], default: null },
  priceMax: { type: [Number, null], default: null },
  sortBy: { type: String, default: '' },
})

const emit = defineEmits(['filterCategory', 'filterBrand', 'filterPrice', 'sort'])

const priceMinInput = ref(props.priceMin)
const priceMaxInput = ref(props.priceMax)

watch(() => props.priceMin, (val) => { priceMinInput.value = val })
watch(() => props.priceMax, (val) => { priceMaxInput.value = val })

function applyPrice() {
  emit('filterPrice', {
    min: priceMinInput.value || null,
    max: priceMaxInput.value || null,
  })
}
</script>
