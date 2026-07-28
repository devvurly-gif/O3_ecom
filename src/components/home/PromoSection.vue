<template>
  <section v-if="promotions.length" class="py-16 bg-accent-500 text-bg">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center sm:text-left">
      <p class="text-xs font-extrabold uppercase tracking-[0.1em]">Promotions</p>
      <h2 class="mt-2 text-2xl sm:text-3xl">Profitez de nos offres exclusives</h2>
      <p class="mt-2 text-sm opacity-90">
        {{ promotions.length }} promotion{{ promotions.length > 1 ? 's' : '' }} en cours en ce moment.
      </p>
      <router-link
        to="/promotions"
        class="btn mt-6 inline-flex"
        style="border: 1px solid var(--color-bg); color: var(--color-bg)"
      >
        Voir toutes les promotions
      </router-link>
    </div>
  </section>
</template>

<script setup>
defineProps({ promotions: { type: Array, default: () => [] } })
</script>
