<template>
  <footer class="bg-bg border-t-2 border-divider">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid gap-10" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr))">
        <!-- Brand -->
        <div>
          <div class="flex items-center gap-2 mb-4">
            <img v-if="shop.logo" :src="logoUrl" :alt="shopName" width="34" height="34" loading="lazy" decoding="async" class="h-[34px] w-[34px] object-cover" />
            <div v-else class="flex h-[34px] w-[34px] items-center justify-center bg-accent-500 text-bg font-extrabold text-sm">O3</div>
            <span class="text-lg font-extrabold text-ink">{{ shopName }}</span>
          </div>
          <p class="text-sm leading-relaxed text-neutral-700">{{ content.footer.tagline }}</p>
        </div>

        <!-- Links -->
        <div>
          <h3 class="text-sm font-extrabold text-ink mb-4">Navigation</h3>
          <ul class="space-y-2.5">
            <li><router-link to="/" class="text-sm text-neutral-700 hover:text-accent-500 transition">Accueil</router-link></li>
            <li><router-link to="/shop" class="text-sm text-neutral-700 hover:text-accent-500 transition">Boutique</router-link></li>
            <li><router-link to="/promotions" class="text-sm text-neutral-700 hover:text-accent-500 transition">Promotions</router-link></li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h3 class="text-sm font-extrabold text-ink mb-4">Contact</h3>
          <ul class="space-y-2.5 text-sm">
            <li v-if="email" class="flex items-center gap-2">
              <EnvelopeIcon class="h-[15px] w-[15px] text-neutral-600 flex-shrink-0" />
              <a :href="`mailto:${email}`" class="text-neutral-700 hover:text-accent-500 transition">{{ email }}</a>
            </li>
            <li v-if="phone" class="flex items-center gap-2">
              <PhoneIcon class="h-[15px] w-[15px] text-neutral-600 flex-shrink-0" />
              <a :href="`tel:${String(phone).replace(/\s+/g, '')}`" class="text-neutral-700 hover:text-accent-500 transition">{{ phone }}</a>
            </li>
            <li v-if="address" class="flex items-center gap-2">
              <MapPinIcon class="h-[15px] w-[15px] text-neutral-600 flex-shrink-0" />
              <span class="text-neutral-700">{{ address }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-10 border-t border-divider pt-6 text-center text-xs text-neutral-600">
        &copy; {{ new Date().getFullYear() }} {{ shopName }}. Tous droits réservés.
      </div>
    </div>
  </footer>
</template>

<script setup>
import { inject, computed } from 'vue'
import { useImageUrl } from '@/composables/useImageUrl'
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/vue/24/outline'
import { useShopContact } from '@/composables/useShopContact'
import { content } from '@/config/content'

const config = inject('shopConfig', {})
const { imageUrl } = useImageUrl()

const { phone, email, address } = useShopContact()

const shop = computed(() => config?.shop ?? {})
const shopName = computed(() => shop.value.name || 'O3 Store')
const logoUrl = computed(() => shop.value.logo ? imageUrl(shop.value.logo) : null)
</script>
