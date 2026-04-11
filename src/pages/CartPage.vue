<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8">Mon Panier</h1>

    <div v-if="cart.items.length" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Items -->
      <div class="lg:col-span-2 space-y-4">
        <div
          v-for="item in cart.items"
          :key="item.id"
          class="flex gap-4 sm:gap-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 sm:p-6"
        >
          <router-link :to="`/product/${item.slug}`" class="shrink-0">
            <img :src="imageUrl(item.image)" :alt="item.title" class="h-24 w-24 sm:h-28 sm:w-28 rounded-xl object-cover bg-gray-50 dark:bg-gray-700" />
          </router-link>
          <div class="flex-1 min-w-0">
            <router-link :to="`/product/${item.slug}`" class="text-sm sm:text-base font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition">
              {{ item.title }}
            </router-link>
            <div class="mt-1 flex items-baseline gap-2">
              <span class="text-sm font-bold text-primary-600 dark:text-primary-400">{{ formatPrice(cart.itemPrice(item)) }}</span>
              <span v-if="item.has_promo && item.promo_price_ttc != null" class="text-xs text-gray-400 dark:text-gray-500 line-through">{{ formatPrice(item.price_ttc) }}</span>
            </div>
            <div class="mt-4 flex items-center justify-between">
              <div class="flex items-center rounded-lg border border-gray-200 dark:border-gray-600">
                <button @click="cart.updateQuantity(item.id, item.quantity - 1)" class="px-3 py-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm">-</button>
                <span class="w-8 text-center text-sm font-medium text-gray-900 dark:text-white">{{ item.quantity }}</span>
                <button @click="cart.updateQuantity(item.id, item.quantity + 1)" class="px-3 py-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm">+</button>
              </div>
              <div class="flex items-center gap-4">
                <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ formatPrice(cart.itemPrice(item) * item.quantity) }}</span>
                <button @click="cart.removeItem(item.id)" class="text-gray-400 hover:text-red-500 transition">
                  <TrashIcon class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary -->
      <div class="lg:col-span-1">
        <div class="sticky top-24 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resume de la commande</h2>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Sous-total ({{ cart.totalItems }} articles)</span>
              <span>{{ formatPrice(cart.totalPrice) }}</span>
            </div>
            <div class="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Livraison</span>
              <span class="text-green-600 dark:text-green-400 font-medium">Gratuite</span>
            </div>
            <div class="border-t border-gray-200 dark:border-gray-600 pt-3 flex justify-between text-base font-bold text-gray-900 dark:text-white">
              <span>Total</span>
              <span>{{ formatPrice(cart.totalPrice) }}</span>
            </div>
          </div>
          <router-link
            to="/checkout"
            class="mt-6 block w-full rounded-xl bg-primary-600 py-3.5 text-center text-sm font-semibold text-white hover:bg-primary-700 transition"
          >
            Passer la commande
          </router-link>
          <router-link to="/shop" class="mt-3 block text-center text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition">
            Continuer les achats
          </router-link>
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div v-else class="flex flex-col items-center justify-center py-20 text-center">
      <ShoppingCartIcon class="h-16 w-16 text-gray-300 dark:text-gray-600" />
      <h2 class="mt-4 text-lg font-semibold text-gray-900 dark:text-white">Votre panier est vide</h2>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Ajoutez des produits pour commencer</p>
      <router-link to="/shop" class="mt-6 rounded-xl bg-primary-600 px-8 py-3 text-sm font-semibold text-white hover:bg-primary-700 transition">
        Voir la boutique
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cartStore'
import { useFormatPrice } from '@/composables/useFormatPrice'
import { useImageUrl } from '@/composables/useImageUrl'
import { TrashIcon, ShoppingCartIcon } from '@heroicons/vue/24/outline'

const cart = useCartStore()
const { formatPrice } = useFormatPrice()
const { imageUrl } = useImageUrl()
</script>
