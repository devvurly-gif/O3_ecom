<template>
  <nav v-if="lastPage > 1" class="mt-8 flex justify-center gap-2">
    <button
      v-for="page in pages"
      :key="page"
      @click="$emit('changePage', page)"
      class="btn"
      :class="page === currentPage ? 'btn-primary' : 'btn-secondary'"
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
