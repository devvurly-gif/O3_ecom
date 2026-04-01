<template>
  <nav v-if="lastPage > 1" class="mt-8 flex justify-center gap-1">
    <button
      v-for="page in pages"
      :key="page"
      @click="$emit('changePage', page)"
      :class="[
        'rounded-lg px-3.5 py-2 text-sm font-medium transition',
        page === currentPage
          ? 'bg-primary-600 text-white'
          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700',
      ]"
    >
      {{ page }}
    </button>
  </nav>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: { type: Number, required: true },
  lastPage: { type: Number, required: true },
})

defineEmits(['changePage'])

const pages = computed(() => {
  const range = []
  const start = Math.max(1, props.currentPage - 2)
  const end = Math.min(props.lastPage, props.currentPage + 2)
  for (let i = start; i <= end; i++) range.push(i)
  return range
})
</script>
