<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8">Passer la commande</h1>

    <div v-if="!cart.items.length && !submitted" class="py-20 text-center">
      <p class="text-gray-500 dark:text-gray-400">Votre panier est vide</p>
      <router-link to="/shop" class="mt-4 inline-block text-sm font-medium text-primary-600 dark:text-primary-400">Voir la boutique</router-link>
    </div>

    <div v-else-if="!submitted" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Form -->
      <div class="lg:col-span-2">
        <form @submit.prevent="submitOrder" class="space-y-6">
          <div class="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-6 space-y-5">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Informations de livraison</h2>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nom complet</label>
                <input v-model="form.name" type="text" required class="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Telephone</label>
                <input v-model="form.phone" type="tel" required class="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <input v-model="form.email" type="email" required class="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Adresse</label>
              <input v-model="form.address" type="text" required class="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Ville</label>
                <input v-model="form.city" type="text" required class="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Notes (optionnel)</label>
                <input v-model="form.notes" type="text" class="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
              </div>
            </div>
          </div>

          <!-- Error message -->
          <div v-if="error" class="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
            <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
          </div>

          <button
            type="submit"
            :disabled="loading"
            :class="[
              'w-full rounded-xl py-3.5 text-sm font-semibold text-white transition',
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700',
            ]"
          >
            {{ loading ? 'Envoi en cours...' : 'Confirmer la commande' }}
          </button>
        </form>
      </div>

      <!-- Order summary -->
      <div>
        <div class="sticky top-24 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Votre commande</h2>
          <div class="space-y-3 divide-y divide-gray-200 dark:divide-gray-700">
            <div v-for="item in cart.items" :key="item.id" class="flex justify-between pt-3 first:pt-0 text-sm">
              <span class="text-gray-600 dark:text-gray-400">{{ item.title }} <span class="text-gray-400 dark:text-gray-500">x{{ item.quantity }}</span></span>
              <span class="font-medium text-gray-900 dark:text-white">{{ formatPrice(cart.itemPrice(item) * item.quantity) }}</span>
            </div>
          </div>
          <div class="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between text-base font-bold text-gray-900 dark:text-white">
            <span>Total</span>
            <span>{{ formatPrice(cart.totalPrice) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Success -->
    <div v-else class="py-20 text-center">
      <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
        <CheckIcon class="h-8 w-8 text-green-600 dark:text-green-400" />
      </div>
      <h2 class="mt-6 text-2xl font-bold text-gray-900 dark:text-white">Commande envoyee !</h2>
      <p class="mt-2 text-gray-500 dark:text-gray-400">Merci pour votre commande. Votre devis a ete cree avec succes.</p>
      <p v-if="orderReference" class="mt-3 text-lg font-semibold text-primary-600 dark:text-primary-400">
        Reference : {{ orderReference }}
      </p>
      <router-link to="/" class="mt-6 inline-block rounded-xl bg-primary-600 px-8 py-3 text-sm font-semibold text-white hover:bg-primary-700 transition">
        Retour a l'accueil
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import api from '@/api/axios'
import { useCartStore } from '@/stores/cartStore'
import { useFormatPrice } from '@/composables/useFormatPrice'
import { CheckIcon } from '@heroicons/vue/24/solid'

const cart = useCartStore()
const { formatPrice } = useFormatPrice()

const submitted = ref(false)
const loading = ref(false)
const error = ref('')
const orderReference = ref('')

const form = reactive({
  name: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  notes: '',
})

async function submitOrder() {
  loading.value = true
  error.value = ''

  try {
    const payload = {
      customer: {
        name: form.name,
        phone: form.phone,
        email: form.email,
        address: form.address,
        city: form.city,
      },
      notes: form.notes || null,
      items: cart.items.map(item => ({
        product_id: item.id,
        designation: item.title,
        quantity: item.quantity,
        unit_price: cart.itemPrice(item),
        tax_percent: 0,
      })),
    }

    const res = await api.post('/orders', payload)
    orderReference.value = res.data.reference
    submitted.value = true
    cart.clearCart()
  } catch (e) {
    if (e.response?.data?.message) {
      error.value = e.response.data.message
    } else if (e.response?.data?.errors) {
      const firstError = Object.values(e.response.data.errors)[0]
      error.value = Array.isArray(firstError) ? firstError[0] : firstError
    } else {
      error.value = 'Une erreur est survenue. Veuillez reessayer.'
    }
  } finally {
    loading.value = false
  }
}
</script>
