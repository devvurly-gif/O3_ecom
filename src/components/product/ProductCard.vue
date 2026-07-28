<template>
  <router-link :to="`/product/${product.slug}`" class="group flex flex-col h-full border border-divider bg-bg">
    <div class="relative">
      <div class="grayscale aspect-square overflow-hidden bg-surface">
        <img
          :src="imageUrl(product.image || product.images?.[0]?.url || product.images?.[0])"
          :alt="product.title"
          class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <!-- Promo badge -->
      <span v-if="product.has_promo" class="tag tag-accent absolute top-2.5 left-2.5">
        -{{ product.discount_percent }}%
      </span>

      <!-- New badge -->
      <span v-else-if="product.is_new" class="tag tag-outline absolute top-2.5 left-2.5 bg-bg">
        Nouveau
      </span>
    </div>

    <div class="p-4 flex flex-col gap-1.5 flex-1">
      <p v-if="product.category" class="text-[11px] font-extrabold uppercase tracking-wide text-accent-700">{{ product.category.name }}</p>
      <p class="text-sm font-bold leading-snug flex-1 line-clamp-2 text-ink">
        {{ product.title }}
      </p>

      <div class="mt-1 flex items-center justify-between">
        <div class="flex items-baseline gap-2">
          <span class="text-base font-extrabold text-ink">{{ formatPrice(product.has_promo ? product.promo_price_ttc : product.price_ttc) }}</span>
          <span v-if="product.has_promo" class="text-xs text-neutral-500 line-through">{{ formatPrice(product.price_ttc) }}</span>
        </div>
        <button
          @click.prevent="cart.addItem(product)"
          class="btn btn-icon btn-primary"
          title="Ajouter au panier"
        >
          <PlusIcon class="h-4 w-4" />
        </button>
      </div>
    </div>
  </router-link>
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
