<template>
  <section class="py-16 bg-surface">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col items-center gap-3 mb-10">
        <Skeleton width="14rem" height="1.9rem" />
        <Skeleton width="22rem" height="1rem" />
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <div v-for="n in count" :key="n" class="flex flex-col items-center border border-divider p-6 gap-3">
          <Skeleton width="3.5rem" height="3.5rem" />
          <Skeleton width="70%" height="0.9rem" />
          <Skeleton width="40%" height="0.75rem" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import Skeleton from './Skeleton.vue'

defineProps({ count: { type: Number, default: 8 } })
</script>
