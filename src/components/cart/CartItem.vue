<template>
  <div class="flex gap-4 rounded-xl bg-gray-50 dark:bg-gray-800 p-3">
    <img
      :src="imageUrl(item.image)"
      :alt="item.title"
      class="h-20 w-20 rounded-lg object-cover bg-white dark:bg-gray-700"
    />
    <div class="flex-1 min-w-0">
      <router-link :to="`/product/${item.slug}`" class="text-sm font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 line-clamp-1">
        {{ item.title }}
      </router-link>
      <!-- Variant badge -->
      <span v-if="item.variant_label" class="inline-block mt-0.5 px-2 py-0.5 text-xs rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 font-medium">
        {{ item.variant_label }}
      </span>
      <p class="mt-1 text-sm font-semibold text-primary-600 dark:text-primary-400">{{ formatPrice(cart.itemPrice(item)) }}</p>
      <div class="mt-2 flex items-center gap-2">
        <button @click="cart.updateQuantity(item._key, item.quantity - 1)" class="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 text-xs">-</button>
        <span class="w-6 text-center text-sm font-medium text-gray-900 dark:text-white">{{ item.quantity }}</span>
        <button @click="cart.updateQuantity(item._key, item.quantity + 1)" class="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 text-xs">+</button>
        <button @click="cart.removeItem(item._key)" class="ml-auto text-gray-400 hover:text-red-500 transition">
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
