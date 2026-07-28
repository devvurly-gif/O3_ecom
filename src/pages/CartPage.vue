<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-2xl sm:text-3xl text-ink mb-8">Mon Panier</h1>

    <div v-if="cart.items.length" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Items -->
      <div class="lg:col-span-2 space-y-4">
        <div
          v-for="item in cart.items"
          :key="item.id"
          class="flex gap-4 sm:gap-6 border border-divider p-4 sm:p-6"
        >
          <router-link :to="`/product/${item.slug}`" class="shrink-0">
            <img :src="imageUrl(item.image)" :alt="item.title" class="grayscale h-24 w-24 sm:h-28 sm:w-28 object-cover bg-surface" />
          </router-link>
          <div class="flex-1 min-w-0">
            <router-link :to="`/product/${item.slug}`" class="text-sm sm:text-base font-bold text-ink hover:text-accent-500 transition">
              {{ item.title }}
            </router-link>
            <div class="mt-1 flex items-baseline gap-2">
              <span class="text-sm font-extrabold text-ink">{{ formatPrice(cart.itemPrice(item)) }}</span>
              <span v-if="item.has_promo && item.promo_price_ttc != null" class="text-xs text-neutral-500 line-through">{{ formatPrice(item.price_ttc) }}</span>
            </div>
            <div class="mt-4 flex items-center justify-between">
              <div class="flex items-center border border-divider">
                <button @click="cart.updateQuantity(item.id, item.quantity - 1)" class="px-3 py-1.5 text-neutral-600 hover:text-ink text-sm">-</button>
                <span class="w-8 text-center text-sm font-medium text-ink">{{ item.quantity }}</span>
                <button @click="cart.updateQuantity(item.id, item.quantity + 1)" class="px-3 py-1.5 text-neutral-600 hover:text-ink text-sm">+</button>
              </div>
              <div class="flex items-center gap-4">
                <span class="text-sm font-bold text-ink">{{ formatPrice(cart.itemPrice(item) * item.quantity) }}</span>
                <button @click="cart.removeItem(item.id)" class="btn-ghost">
                  <TrashIcon class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary -->
      <div class="lg:col-span-1">
        <div class="sticky top-24 card border border-divider">
          <h2 class="card-title mb-2">Resume de la commande</h2>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between text-neutral-600">
              <span>Sous-total ({{ cart.totalItems }} articles)</span>
              <span>{{ formatPrice(cart.totalPrice) }}</span>
            </div>
            <div class="flex justify-between text-neutral-600">
              <span>Livraison</span>
              <span class="text-ink font-medium">Gratuite</span>
            </div>
            <hr class="hr" />
            <div class="flex justify-between text-base font-extrabold text-ink">
              <span>Total</span>
              <span>{{ formatPrice(cart.totalPrice) }}</span>
            </div>
          </div>
          <router-link to="/checkout" class="btn btn-primary btn-block mt-6">
            Passer la commande
          </router-link>
          <router-link to="/shop" class="btn btn-secondary btn-block mt-3">
            Continuer les achats
          </router-link>
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div v-else class="flex flex-col items-center justify-center py-20 text-center">
      <ShoppingCartIcon class="h-16 w-16 text-neutral-400" />
      <h2 class="mt-4 text-lg font-bold text-ink">Votre panier est vide</h2>
      <p class="mt-1 text-sm text-neutral-600">Ajoutez des produits pour commencer</p>
      <router-link to="/shop" class="btn btn-primary mt-6">
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
