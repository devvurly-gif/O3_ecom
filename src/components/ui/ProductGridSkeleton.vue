<template>
  <!-- Mêmes gabarits que ProductGrid/ProductCard : la grille ne doit pas
       sursauter quand les vraies cartes remplacent les squelettes. -->
  <div class="grid gap-6 sm:gap-8" style="grid-template-columns: repeat(auto-fill, minmax(220px, 1fr))">
    <div v-for="n in count" :key="n" class="flex flex-col h-full border border-divider bg-bg">
      <Skeleton height="0" class="aspect-square" />
      <div class="p-5 flex flex-col gap-2 flex-1">
        <Skeleton width="45%" height="0.7rem" />
        <Skeleton width="90%" height="0.9rem" />
        <Skeleton width="70%" height="0.9rem" />
        <div class="mt-3 flex items-center justify-between">
          <Skeleton width="38%" height="1.1rem" />
          <Skeleton width="2rem" height="2rem" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Skeleton from './Skeleton.vue'

defineProps({ count: { type: Number, default: 8 } })
</script>
