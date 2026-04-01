<template>
  <section v-if="promotions.length" class="py-16 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-10">
        <h2 class="text-2xl sm:text-3xl font-bold">Promotions en cours</h2>
        <p class="mt-2 text-primary-100">Profitez de nos offres exclusives</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <router-link
          v-for="promo in promotions"
          :key="promo.id"
          :to="{ name: 'promotion', params: { slug: promo.slug } }"
          class="group relative rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 hover:bg-white/20 transition overflow-hidden"
        >
          <img
            v-if="promo.banner_image"
            :src="imageUrl(promo.banner_image)"
            :alt="promo.name"
            class="absolute inset-0 h-full w-full object-cover opacity-20 group-hover:opacity-30 transition"
          />
          <div class="relative">
            <span class="inline-flex items-center rounded-full bg-red-500 px-3 py-1 text-xs font-bold">
              {{ promo.type === 'percentage' ? `-${promo.value}%` : `-${promo.value} MAD` }}
            </span>
            <h3 class="mt-4 text-lg font-bold">{{ promo.name }}</h3>
            <p v-if="promo.description" class="mt-2 text-sm text-primary-100 line-clamp-2">{{ promo.description }}</p>
            <p v-if="promo.ends_at" class="mt-3 text-xs text-primary-200">
              Jusqu'au {{ new Date(promo.ends_at).toLocaleDateString('fr-FR') }}
            </p>
          </div>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useImageUrl } from '@/composables/useImageUrl'

defineProps({ promotions: { type: Array, default: () => [] } })
const { imageUrl } = useImageUrl()
</script>
