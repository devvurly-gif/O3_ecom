<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="cart.drawerOpen" class="fixed inset-0 z-50 bg-black/40" @click="cart.drawerOpen = false"></div>
    </Transition>

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div v-if="cart.drawerOpen" class="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl flex flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 px-6 py-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Panier ({{ cart.totalItems }})</h2>
          <button @click="cart.drawerOpen = false" class="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition">
            <XMarkIcon class="h-5 w-5" />
          </button>
        </div>

        <!-- Items -->
        <div v-if="cart.items.length" class="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <CartItem v-for="item in cart.items" :key="item.id" :item="item" />
        </div>
        <div v-else class="flex-1 flex items-center justify-center">
          <div class="text-center">
            <ShoppingBagIcon class="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
            <p class="mt-3 text-sm text-gray-500 dark:text-gray-400">Votre panier est vide</p>
            <router-link
              @click="cart.drawerOpen = false"
              to="/shop"
              class="mt-4 inline-block rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700 transition"
            >
              Voir la boutique
            </router-link>
          </div>
        </div>

        <!-- Footer -->
        <div v-if="cart.items.length" class="border-t border-gray-100 dark:border-gray-800 px-6 py-4 space-y-4">
          <div class="flex items-center justify-between text-base font-semibold text-gray-900 dark:text-white">
            <span>Total</span>
            <span>{{ formatPrice(cart.totalPrice) }}</span>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <router-link
              @click="cart.drawerOpen = false"
              to="/cart"
              class="rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              Voir le panier
            </router-link>
            <router-link
              @click="cart.drawerOpen = false"
              to="/checkout"
              class="rounded-lg bg-primary-600 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-700 transition"
            >
              Commander
            </router-link>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { useCartStore } from '@/stores/cartStore'
import { useFormatPrice } from '@/composables/useFormatPrice'
import { XMarkIcon, ShoppingBagIcon } from '@heroicons/vue/24/outline'
import CartItem from './CartItem.vue'

const cart = useCartStore()
const { formatPrice } = useFormatPrice()
</script>
