<template>
  <!-- Exactement la hauteur du HeroSlider (420 / 500 px) pour que l'arrivée du
       vrai slide ne décale pas le reste de la page. -->
  <section class="relative overflow-hidden bg-neutral-900">
    <div class="h-[420px] sm:h-[500px] relative">
      <Skeleton height="100%" />
      <div class="absolute inset-0 flex items-center">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div class="max-w-lg space-y-4">
            <Skeleton width="70%" height="2.6rem" />
            <Skeleton width="55%" height="1.1rem" />
            <Skeleton width="9rem" height="2.6rem" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import Skeleton from './Skeleton.vue'
</script>
