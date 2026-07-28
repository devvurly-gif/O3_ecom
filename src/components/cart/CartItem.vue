<template>
  <div class="flex gap-4 border border-divider p-3">
    <img
      :src="imageUrl(item.image)"
      :alt="item.title"
      class="grayscale h-20 w-20 object-cover bg-surface"
    />
    <div class="flex-1 min-w-0">
      <router-link :to="`/product/${item.slug}`" class="text-sm font-medium text-ink hover:text-accent-500 line-clamp-1">
        {{ item.title }}
      </router-link>
      <!-- Variant badge -->
      <span v-if="item.variant_label" class="tag tag-neutral inline-block mt-0.5">
        {{ item.variant_label }}
      </span>
      <p class="mt-1 text-sm font-bold text-ink">{{ formatPrice(cart.itemPrice(item)) }}</p>
      <div class="mt-2 flex items-center gap-2">
        <button @click="cart.updateQuantity(item._key, item.quantity - 1)" class="flex h-7 w-7 items-center justify-center border border-divider bg-bg text-neutral-600 hover:bg-neutral-100 text-xs">-</button>
        <span class="w-6 text-center text-sm font-medium text-ink">{{ item.quantity }}</span>
        <button @click="cart.updateQuantity(item._key, item.quantity + 1)" class="flex h-7 w-7 items-center justify-center border border-divider bg-bg text-neutral-600 hover:bg-neutral-100 text-xs">+</button>
        <button @click="cart.removeItem(item._key)" class="ml-auto btn-ghost">
          <TrashIcon class="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cartStore'
import { useFormatPrice } from '@/composables/useFormatPrice'
import { useImageUrl } from '@/composables/useImageUrl'
import { TrashIcon } from '@heroicons/vue/24/outline'

defineProps({ item: { type: Object, required: true } })
const cart = useCartStore()
const { formatPrice } = useFormatPrice()
const { imageUrl } = useImageUrl()
</script>
