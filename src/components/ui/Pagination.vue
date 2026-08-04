<template>
  <nav v-if="lastPage > 1" class="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
    <button
      type="button"
      class="btn btn-secondary"
      :disabled="currentPage <= 1"
      :class="currentPage <= 1 ? 'opacity-40 cursor-not-allowed' : ''"
      @click="$emit('changePage', currentPage - 1)"
    >
      <ChevronLeftIcon class="h-4 w-4" />
      <span class="sr-only">Page précédente</span>
    </button>

    <template v-for="(p, i) in pages" :key="i">
      <span v-if="p === '…'" class="px-1 text-neutral-500 select-none">…</span>
      <button
        v-else
        type="button"
        class="btn"
        :class="p === currentPage ? 'btn-primary' : 'btn-secondary'"
        :aria-current="p === currentPage ? 'page' : undefined"
        @click="$emit('changePage', p)"
      >
        {{ p }}
      </button>
    </template>

    <button
      type="button"
      class="btn btn-secondary"
      :disabled="currentPage >= lastPage"
      :class="currentPage >= lastPage ? 'opacity-40 cursor-not-allowed' : ''"
      @click="$emit('changePage', currentPage + 1)"
    >
      <ChevronRightIcon class="h-4 w-4" />
      <span class="sr-only">Page suivante</span>
    </button>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  currentPage: { type: Number, required: true },
  lastPage: { type: Number, required: true },
})

defineEmits(['changePage'])

/**
 * Fenêtre glissante, première et dernière page toujours accessibles.
 *
 * L'ancienne version n'affichait que currentPage ± 2, sans précédent ni
 * suivant : sur les 14 pages du catalogue, impossible de revenir au début ou
 * de sauter à la fin autrement qu'en cliquant page après page.
 */
const pages = computed(() => {
  const courante = props.currentPage
  const derniere = props.lastPage
  const fenetre = []

  const debut = Math.max(1, courante - 1)
  const fin = Math.min(derniere, courante + 1)

  if (debut > 1) {
    fenetre.push(1)
    if (debut > 2) fenetre.push('…')
  }

  for (let i = debut; i <= fin; i++) fenetre.push(i)

  if (fin < derniere) {
    if (fin < derniere - 1) fenetre.push('…')
    fenetre.push(derniere)
  }

  return fenetre
})
</script>
