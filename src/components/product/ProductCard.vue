<template>
  <router-link :to="`/product/${product.slug}`" class="group flex flex-col h-full border border-divider bg-bg">
    <div class="relative">
      <div class="aspect-square overflow-hidden bg-surface">
        <!-- width/height : le ratio est réservé avant le chargement, la grille
             ne saute pas. Le conteneur est en aspect-square, ces valeurs ne
             servent qu'au calcul de réservation. -->
        <img
          :src="imageUrl(product.image || product.images?.[0]?.url || product.images?.[0])"
          :alt="product.title"
          width="400"
          height="400"
          loading="lazy"
          decoding="async"
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

    <div class="p-5 flex flex-col gap-2 flex-1">
      <p v-if="product.category" class="text-[11px] font-extrabold uppercase tracking-wide text-accent-700">{{ product.category.name }}</p>
      <p class="text-sm font-bold leading-snug flex-1 line-clamp-2 text-ink">
        {{ product.title }}
      </p>

      <div class="mt-3 flex items-center justify-between gap-2">
        <div v-if="achetable" class="flex items-baseline gap-2">
          <span class="text-base font-extrabold text-ink">{{ formatPrice(effectivePrice(product)) }}</span>
          <span v-if="product.has_promo" class="text-xs text-neutral-500 line-through">{{ formatPrice(product.price_ttc) }}</span>
        </div>
        <!-- Prix non saisi dans l'ERP : afficher « 0,00 MAD » serait faux. -->
        <span v-else class="text-sm font-bold text-accent-700">{{ content.price.onRequest }}</span>

        <button
          v-if="achetable"
          @click.prevent="cart.addItem(product)"
          class="btn btn-icon btn-primary shrink-0"
          title="Ajouter au panier"
        >
          <PlusIcon class="h-4 w-4" />
        </button>
        <button
          v-else
          type="button"
          disabled
          class="btn btn-icon btn-secondary shrink-0 opacity-45 cursor-not-allowed"
          :title="content.price.cardHint"
        >
          <PlusIcon class="h-4 w-4" />
        </button>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'
import { useCartStore } from '@/stores/cartStore'
import { useFormatPrice } from '@/composables/useFormatPrice'
import { useImageUrl } from '@/composables/useImageUrl'
import { content } from '@/config/content'
import { PlusIcon } from '@heroicons/vue/24/solid'

const props = defineProps({ product: { type: Object, required: true } })
const cart = useCartStore()
const { formatPrice, effectivePrice, isPurchasable } = useFormatPrice()
const { imageUrl } = useImageUrl()

const achetable = computed(() => isPurchasable(props.product))
</script>
