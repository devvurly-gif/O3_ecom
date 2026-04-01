<template>
  <div class="group relative rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 overflow-hidden transition hover:shadow-lg hover:border-gray-200 dark:hover:border-gray-600">
    <!-- Image -->
    <router-link :to="`/product/${product.slug}`" class="block aspect-square overflow-hidden bg-gray-50 dark:bg-gray-700">
      <img
        :src="imageUrl(product.image ?? product.images?.[0])"
        :alt="product.title"
        class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />
    </router-link>

    <!-- Promo badge -->
    <div v-if="product.has_promo" class="absolute top-3 left-3">
      <span class="inline-flex items-center rounded-full bg-red-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
        -{{ product.discount_percent }}%
      </span>
    </div>

    <!-- New badge -->
    <div v-if="product.is_new && !product.has_promo" class="absolute top-3 left-3">
      <span class="inline-flex items-center rounded-full bg-green-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
        Nouveau
      </span>
    </div>

    <!-- Info -->
    <div class="p-4">
      <p v-if="product.category" class="mb-1 text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wide">{{ product.category.name }}</p>
      <router-link :to="`/product/${product.slug}`" class="block text-sm font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition line-clamp-2 leading-snug">
        {{ product.title }}
      </router-link>

      <div class="mt-3 flex items-center justify-between">
        <div class="flex items-baseline gap-2">
          <span class="text-lg font-bold text-gray-900 dark:text-white">{{ formatPrice(product.has_promo ? product.promo_price_ttc : product.price_ttc) }}</span>
          <span v-if="product.has_promo" class="text-sm text-gray-400 dark:text-gray-500 line-through">{{ formatPrice(product.price_ttc) }}</span>
        </div>
        <button
          @click.prevent="cart.addItem(product)"
          class="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-white shadow-sm hover:bg-primary-700 transition active:scale-95"
          title="Ajouter au panier"
        >
          <PlusIcon class="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cartStore'
import { useFormatPrice } from '@/composables/useFormatPrice'
import { useImageUrl } from '@/composables/useImageUrl'
import { PlusIcon } from '@heroicons/vue/24/solid'

defineProps({ product: { type: Object, required: true } })
const cart = useCartStore()
const { formatPrice } = useFormatPrice()
const { imageUrl } = useImageUrl()
</script>
