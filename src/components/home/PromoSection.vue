<template>
  <section v-if="promotions.length" class="py-16 bg-accent-500 text-bg">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center sm:text-left">
      <p class="text-xs font-extrabold uppercase tracking-[0.1em]">{{ content.home.promoBanner.eyebrow }}</p>
      <h2 class="mt-2 text-2xl sm:text-3xl">{{ content.home.promoBanner.title }}</h2>
      <p class="mt-2 text-sm opacity-90">
        {{ content.home.promoBanner.count(promotions.length) }}
      </p>
      <router-link
        to="/promotions"
        class="btn mt-6 inline-flex"
        style="border: 1px solid var(--color-bg); color: var(--color-bg)"
      >
        {{ content.home.promoBanner.cta }}
      </router-link>
    </div>
  </section>
</template>

<script setup>
import { content } from '@/config/content'

defineProps({ promotions: { type: Array, default: () => [] } })
</script>
