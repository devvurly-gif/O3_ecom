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
      <div v-if="cart.drawerOpen" class="dialog-backdrop fixed inset-0 z-50" @click="cart.drawerOpen = false"></div>
    </Transition>

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div v-if="cart.drawerOpen" class="fixed inset-y-0 right-0 z-50 w-full max-w-[440px] bg-bg border-l-2 border-divider shadow-[var(--shadow-lg)] flex flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-divider px-6 py-4">
          <h2 class="text-lg text-ink">Panier ({{ cart.totalItems }})</h2>
          <button @click="cart.drawerOpen = false" class="btn-ghost">
            <XMarkIcon class="h-5 w-5" />
          </button>
        </div>

        <!-- Items -->
        <div v-if="cart.items.length" class="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <CartItem v-for="item in cart.items" :key="item.id" :item="item" />
        </div>
        <div v-else class="flex-1 flex items-center justify-center">
          <div class="text-center">
            <ShoppingBagIcon class="mx-auto h-12 w-12 text-neutral-400" />
            <p class="mt-3 text-sm text-neutral-600">Votre panier est vide</p>
            <router-link
              @click="cart.drawerOpen = false"
              to="/shop"
              class="btn btn-primary mt-4"
            >
              Voir la boutique
            </router-link>
          </div>
        </div>

        <!-- Footer -->
        <div v-if="cart.items.length" class="border-t border-divider px-6 py-4 space-y-4">
          <div class="flex items-center justify-between text-[17px] font-extrabold text-ink">
            <span>Total</span>
            <span>{{ formatPrice(cart.totalPrice) }}</span>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <router-link
              @click="cart.drawerOpen = false"
              to="/cart"
              class="btn btn-secondary"
            >
              Voir le panier
            </router-link>
            <router-link
              @click="cart.drawerOpen = false"
              to="/checkout"
              class="btn btn-primary"
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
