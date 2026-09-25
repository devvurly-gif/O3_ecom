<template>
  <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-2xl sm:text-3xl text-ink mb-2">Commande rapide</h1>
    <p class="text-sm text-neutral-600 mb-8">
      Tapez votre commande comme dans un message : un article par ligne, la quantité puis le produit. Nous préparons un
      bon de livraison et le confirmons avec vous.
    </p>

    <!-- 1. Numéro -->
    <div v-if="step === 'phone'" class="card border border-divider space-y-5">
      <h2 class="card-title">Votre numéro de téléphone</h2>
      <p class="text-sm text-neutral-600">
        Le numéro enregistré sur votre compte client. Vous recevrez un code par SMS ou WhatsApp.
      </p>
      <form @submit.prevent="requestCode">
        <div class="field">
          <label>Téléphone</label>
          <input v-model="phone" type="tel" required autofocus class="input" placeholder="06 12 34 56 78" />
        </div>
        <p v-if="error" class="mt-3 text-sm text-accent-700">{{ error }}</p>
        <button type="submit" :disabled="loading" class="btn btn-primary btn-block mt-4" :class="{ 'opacity-45 cursor-not-allowed': loading }">
          {{ loading ? 'Envoi…' : 'Recevoir un code' }}
        </button>
      </form>
    </div>

    <!-- 2. Code -->
    <div v-else-if="step === 'code'" class="card border border-divider space-y-5">
      <h2 class="card-title">Code de vérification</h2>
      <p class="text-sm text-neutral-600">{{ info }}</p>
      <form @submit.prevent="verifyCode">
        <div class="field">
          <label>Code à 6 chiffres</label>
          <input
            v-model="code"
            type="text"
            inputmode="numeric"
            autocomplete="one-time-code"
            maxlength="6"
            required
            autofocus
            class="input tracking-[0.4em]"
          />
        </div>
        <p v-if="error" class="mt-3 text-sm text-accent-700">{{ error }}</p>
        <button type="submit" :disabled="loading" class="btn btn-primary btn-block mt-4" :class="{ 'opacity-45 cursor-not-allowed': loading }">
          {{ loading ? 'Vérification…' : 'Valider' }}
        </button>
      </form>
      <button type="button" class="text-xs font-bold text-accent-500 hover:underline" @click="restart">
        Changer de numéro
      </button>
    </div>

    <!-- 3. Chat -->
    <div v-else class="card border border-divider flex flex-col">
      <div class="flex items-center justify-between pb-4 border-b border-divider">
        <h2 class="card-title">Bonjour {{ customerName }}</h2>
        <button type="button" class="text-xs font-bold text-accent-500 hover:underline" @click="logout">Se déconnecter</button>
      </div>

      <div ref="threadEl" class="flex-1 min-h-[240px] max-h-[55vh] overflow-y-auto py-4 space-y-3">
        <p v-if="!messages.length" class="text-sm text-neutral-600 text-center py-8">
          Exemple :<br />2 perceuse 18V<br />5 boîte vis 4x40<br />marteau x3
        </p>
        <div v-for="m in messages" :key="m.id" class="flex" :class="m.direction === 'in' ? 'justify-end' : 'justify-start'">
          <div
            class="max-w-[85%] px-4 py-2.5 text-sm whitespace-pre-line"
            :style="
              m.direction === 'in'
                ? 'background: var(--color-accent-100); color: var(--color-accent-800)'
                : 'background: var(--color-neutral-100)'
            "
          >
            {{ m.body }}
          </div>
        </div>
      </div>

      <form class="pt-4 border-t border-divider space-y-3" @submit.prevent="send">
        <textarea
          v-model="text"
          rows="4"
          maxlength="2000"
          class="input w-full"
          placeholder="Un article par ligne : quantité puis produit"
          @keydown.ctrl.enter.prevent="send"
        ></textarea>
        <p v-if="error" class="text-sm text-accent-700">{{ error }}</p>
        <button type="submit" :disabled="loading || !text.trim()" class="btn btn-primary btn-block" :class="{ 'opacity-45 cursor-not-allowed': loading || !text.trim() }">
          {{ loading ? 'Envoi…' : 'Envoyer la commande' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { nextTick, onMounted, ref } from 'vue'
import api from '@/api/axios'

const TOKEN_KEY = 'o3_quick_order_token'

const step = ref('phone')
const phone = ref('')
const code = ref('')
const text = ref('')
const info = ref('')
const error = ref('')
const loading = ref(false)
const customerName = ref('')
const messages = ref([])
const threadEl = ref(null)

function storedToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

function storeToken(token) {
  try {
    token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* navigation privée : la session durera le temps de la page */
  }
}

let token = storedToken()

function chatHeaders() {
  return { headers: { 'X-Chat-Token': token } }
}

function errorMessage(e, fallback) {
  const status = e?.response?.status
  if (status === 429) return 'Trop de tentatives. Réessayez dans quelques minutes.'
  return e?.response?.data?.message || fallback
}

async function requestCode() {
  error.value = ''
  loading.value = true
  try {
    const { data } = await api.post('/chat/code', { phone: phone.value })
    info.value = data.message
    step.value = 'code'
  } catch (e) {
    error.value = errorMessage(e, "Impossible d'envoyer le code pour le moment.")
  } finally {
    loading.value = false
  }
}

async function verifyCode() {
  error.value = ''
  loading.value = true
  try {
    const { data } = await api.post('/chat/verify', { phone: phone.value, code: code.value })
    token = data.token
    storeToken(token)
    customerName.value = data.customer?.name ?? ''
    step.value = 'chat'
    await loadHistory()
  } catch (e) {
    error.value = errorMessage(e, 'Code incorrect ou expiré.')
  } finally {
    loading.value = false
  }
}

async function loadHistory() {
  try {
    const { data } = await api.get('/chat/messages', chatHeaders())
    customerName.value = data.customer?.name ?? customerName.value
    messages.value = data.messages ?? []
    step.value = 'chat'
    scrollToBottom()
  } catch (e) {
    if (e?.response?.status === 401) restart()
  }
}

async function send() {
  if (!text.value.trim() || loading.value) return
  error.value = ''
  loading.value = true
  try {
    await api.post('/chat/messages', { text: text.value }, chatHeaders())
    text.value = ''
    await loadHistory()
  } catch (e) {
    if (e?.response?.status === 401) {
      restart()
      error.value = 'Session expirée : demandez un nouveau code.'
    } else {
      error.value = errorMessage(e, "La commande n'a pas pu être envoyée.")
    }
  } finally {
    loading.value = false
  }
}

async function logout() {
  try {
    await api.post('/chat/logout', {}, chatHeaders())
  } catch {
    /* session déjà expirée */
  }
  restart()
}

function restart() {
  token = null
  storeToken(null)
  step.value = 'phone'
  code.value = ''
  messages.value = []
}

function scrollToBottom() {
  nextTick(() => {
    if (threadEl.value) threadEl.value.scrollTop = threadEl.value.scrollHeight
  })
}

onMounted(() => {
  if (token) loadHistory()
})
</script>
