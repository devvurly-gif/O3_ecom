<template>
  <!-- Reprend la structure de NewArrivals / FeaturedProducts : titre, sous-titre,
       lien « Voir tout », puis la grille de cartes. -->
  <section class="py-16">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between mb-8">
        <div class="space-y-2">
          <Skeleton width="12rem" height="1.9rem" />
          <Skeleton width="17rem" height="1rem" />
        </div>
        <Skeleton width="5.5rem" height="1rem" />
      </div>
      <ProductGridSkeleton :count="count" />
    </div>
  </section>
</template>

<script setup>
import Skeleton from './Skeleton.vue'
import ProductGridSkeleton from './ProductGridSkeleton.vue'

defineProps({ count: { type: Number, default: 5 } })
</script>
