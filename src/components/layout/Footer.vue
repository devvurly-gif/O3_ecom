<template>
  <footer class="bg-gray-900 text-gray-400">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Brand -->
        <div>
          <div class="flex items-center gap-2 mb-4">
            <img v-if="shop.logo" :src="logoUrl" :alt="shopName" class="h-9 w-9 rounded-lg object-cover" />
            <div v-else class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white font-bold">O3</div>
            <span class="text-lg font-bold text-white">{{ shopName }}</span>
          </div>
          <p class="text-sm leading-relaxed">Votre boutique en ligne pour les meilleurs produits au Maroc.</p>
        </div>

        <!-- Links -->
        <div>
          <h3 class="text-sm font-semibold text-white mb-4">Navigation</h3>
          <ul class="space-y-2.5">
            <li><router-link to="/" class="text-sm hover:text-white transition">Accueil</router-link></li>
            <li><router-link to="/shop" class="text-sm hover:text-white transition">Boutique</router-link></li>
            <li><router-link to="/promotions" class="text-sm hover:text-white transition">Promotions</router-link></li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h3 class="text-sm font-semibold text-white mb-4">Contact</h3>
          <ul class="space-y-2.5 text-sm">
            <li v-if="shop.email" class="flex items-center gap-2">
              <EnvelopeIcon class="h-4 w-4 text-gray-500 flex-shrink-0" />
              <a :href="`mailto:${shop.email}`" class="hover:text-white transition">{{ shop.email }}</a>
            </li>
            <li v-if="shop.phone" class="flex items-center gap-2">
              <PhoneIcon class="h-4 w-4 text-gray-500 flex-shrink-0" />
              <a :href="`tel:${shop.phone}`" class="hover:text-white transition">{{ shop.phone }}</a>
            </li>
            <li v-if="shop.address" class="flex items-center gap-2">
              <MapPinIcon class="h-4 w-4 text-gray-500 flex-shrink-0" />
              <span>{{ shop.address }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-10 border-t border-gray-800 pt-6 text-center text-xs">
        &copy; {{ new Date().getFullYear() }} {{ shopName }}. Tous droits r&eacute;serv&eacute;s.
      </div>
    </div>
  </footer>
</template>

<script setup>
import { inject, computed } from 'vue'
import { useImageUrl } from '@/composables/useImageUrl'
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/vue/24/outline'

const config = inject('shopConfig', {})
const { imageUrl } = useImageUrl()

const shop = computed(() => config?.shop ?? {})
const shopName = computed(() => shop.value.name || 'O3 Store')
const logoUrl = computed(() => shop.value.logo ? imageUrl(shop.value.logo) : null)
</script>
