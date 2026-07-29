<template>
  <div class="grid gap-6 sm:gap-8" style="grid-template-columns: repeat(auto-fill, minmax(220px, 1fr))">
    <ProductCard v-for="product in products" :key="product.id" :product="product" />
  </div>
</template>

<script setup>
import ProductCard from './ProductCard.vue'

defineProps({ products: { type: Array, required: true } })
</script>
