<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-2xl sm:text-3xl text-ink mb-8">Passer la commande</h1>

    <div v-if="!cart.items.length && !submitted" class="py-20 text-center">
      <p class="text-neutral-600">Votre panier est vide</p>
      <router-link to="/shop" class="mt-4 inline-block text-sm font-bold text-accent-500">Voir la boutique</router-link>
    </div>

    <div v-else-if="!submitted" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Form -->
      <div class="lg:col-span-2">
        <!-- Step 1: email-first lookup -->
        <div v-if="step === 'email'" class="card border border-divider space-y-5">
          <h2 class="card-title">Votre email</h2>
          <p class="text-sm text-neutral-600">Entrez votre email pour continuer. Si vous avez déjà commandé chez nous, vos informations seront pré-remplies.</p>

          <form @submit.prevent="checkEmail">
            <div class="field">
              <label>Email</label>
              <input
                v-model="form.email"
                type="email"
                required
                autofocus
                class="input"
              />
            </div>

            <p v-if="lookupError" class="mt-3 text-sm text-accent-700">{{ lookupError }}</p>

            <button
              type="submit"
              :disabled="lookupLoading"
              class="btn btn-primary btn-block mt-4"
              :class="{ 'opacity-45 cursor-not-allowed': lookupLoading }"
            >
              {{ lookupLoading ? 'Vérification...' : 'Continuer' }}
            </button>
          </form>

          <!-- Shown once we know this email isn't registered yet -->
          <div v-if="notRegistered" style="background: var(--color-accent-100); border: 1px solid var(--color-accent-300); color: var(--color-accent-800)" class="p-4">
            <p class="text-sm mb-3">Cet email n'est pas encore enregistré.</p>
            <button
              type="button"
              class="btn btn-secondary btn-block"
              @click="startAsNewCustomer"
            >
              Nouveau client — continuer
            </button>
          </div>
        </div>

        <!-- Step 2: full delivery form (prefilled if returning customer) -->
        <form v-else @submit.prevent="submitOrder" class="space-y-6">
          <div class="card border border-divider space-y-5">
            <div class="flex items-center justify-between">
              <h2 class="card-title">Informations de livraison</h2>
              <button type="button" class="text-xs font-bold text-accent-500 hover:underline" @click="backToEmail">
                Modifier l'email
              </button>
            </div>

            <p v-if="isReturning" class="text-sm p-3" style="background: var(--color-accent-100); color: var(--color-accent-800)">
              Bienvenue de nouveau, {{ form.name }} — vérifiez vos informations de livraison ci-dessous.
            </p>

            <div class="field">
              <label>Email</label>
              <input :value="form.email" type="email" disabled class="input" />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="field">
                <label>Nom complet</label>
                <input v-model="form.name" type="text" required class="input" />
              </div>
              <div class="field">
                <label>Telephone</label>
                <input v-model="form.phone" type="tel" required class="input" />
              </div>
            </div>

            <div class="field">
              <label>Adresse</label>
              <input v-model="form.address" type="text" required class="input" />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="field">
                <label>Ville</label>
                <input v-model="form.city" type="text" required class="input" />
              </div>
              <div class="field">
                <label>Notes (optionnel)</label>
                <input v-model="form.notes" type="text" class="input" />
              </div>
            </div>
          </div>

          <!-- Error message -->
          <div v-if="error" class="border border-accent-300 p-4" style="background: var(--color-accent-100)">
            <p class="text-sm text-accent-800">{{ error }}</p>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="btn btn-primary btn-block"
            :class="{ 'opacity-45 cursor-not-allowed': loading }"
          >
            {{ loading ? 'Envoi en cours...' : 'Confirmer la commande' }}
          </button>
        </form>
      </div>

      <!-- Order summary -->
      <div>
        <div class="sticky top-24 card border border-divider">
          <h2 class="card-title mb-2">Votre commande</h2>
          <div class="space-y-3">
            <div v-for="item in cart.items" :key="item.id" class="flex justify-between pt-3 first:pt-0 border-t border-divider first:border-t-0 text-sm">
              <span class="text-neutral-600">{{ item.title }} <span class="text-neutral-500">x{{ item.quantity }}</span></span>
              <span class="font-medium text-ink">{{ formatPrice(cart.itemPrice(item) * item.quantity) }}</span>
            </div>
          </div>
          <hr class="hr" />
          <div class="flex justify-between text-base font-extrabold text-ink">
            <span>Total</span>
            <span>{{ formatPrice(cart.totalPrice) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Success -->
    <div v-else class="py-20 text-center">
      <div class="mx-auto flex h-16 w-16 items-center justify-center bg-accent-500">
        <CheckIcon class="h-8 w-8 text-bg" />
      </div>
      <h2 class="mt-6 text-2xl text-ink">Commande envoyee !</h2>
      <p class="mt-2 text-neutral-600">Merci pour votre commande. Votre devis a ete cree avec succes.</p>
      <p v-if="orderReference" class="mt-3 text-lg font-extrabold text-accent-800">
        Reference : {{ orderReference }}
      </p>
      <router-link to="/" class="btn btn-primary mt-6 inline-flex">
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

// Email-first step: 'email' (just asking for the address) → 'form' (full
// delivery form, prefilled automatically when the email matches an
// existing customer of this tenant).
const step = ref('email')
const lookupLoading = ref(false)
const lookupError = ref('')
const notRegistered = ref(false)
const isReturning = ref(false)

const form = reactive({
  name: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  notes: '',
})

async function checkEmail() {
  lookupError.value = ''
  notRegistered.value = false
  lookupLoading.value = true

  try {
    const res = await api.get('/customers/lookup', { params: { email: form.email } })
    if (res.data.exists) {
      form.name = res.data.customer.name || ''
      form.phone = res.data.customer.phone || ''
      form.address = res.data.customer.address || ''
      form.city = res.data.customer.city || ''
      isReturning.value = true
      step.value = 'form'
    } else {
      notRegistered.value = true
    }
  } catch (e) {
    // Lookup is a convenience, not a gate — if it fails, let the
    // customer proceed as a new customer rather than blocking checkout.
    notRegistered.value = true
  } finally {
    lookupLoading.value = false
  }
}

function startAsNewCustomer() {
  isReturning.value = false
  notRegistered.value = false
  step.value = 'form'
}

function backToEmail() {
  step.value = 'email'
  notRegistered.value = false
  isReturning.value = false
  form.name = ''
  form.phone = ''
  form.address = ''
  form.city = ''
}

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
