<template>
  <section class="relative overflow-hidden bg-gray-900 text-white">
    <div v-if="slides.length" class="relative h-[420px] sm:h-[500px]">
      <TransitionGroup
        enter-active-class="transition duration-700 ease-out"
        enter-from-class="opacity-0 scale-105"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-500 ease-in absolute inset-0"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-for="(slide, i) in slides" :key="slide.id" v-show="current === i" class="absolute inset-0">
          <img :src="imageUrl(slide.image)" :alt="slide.title" class="h-full w-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
          <div class="absolute inset-0 flex items-center">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
              <div class="max-w-lg">
                <h2 class="text-3xl sm:text-5xl font-extrabold leading-tight">{{ slide.title }}</h2>
                <p v-if="slide.subtitle" class="mt-4 text-base sm:text-lg text-gray-200">{{ slide.subtitle }}</p>
                <router-link
                  v-if="slide.button_text"
                  :to="slide.resolved_link || '/shop'"
                  class="mt-6 inline-block rounded-xl bg-primary-600 px-7 py-3 text-sm font-semibold text-white hover:bg-primary-700 transition"
                >
                  {{ slide.button_text }}
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>

      <!-- Dots -->
      <div v-if="slides.length > 1" class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        <button
          v-for="(_, i) in slides"
          :key="i"
          @click="current = i"
          :class="['h-2 rounded-full transition-all', current === i ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/75']"
        ></button>
      </div>
    </div>

    <!-- Fallback if no slides -->
    <div v-else class="h-[420px] sm:h-[500px] flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-800">
      <div class="text-center px-4">
        <h2 class="text-3xl sm:text-5xl font-extrabold">Bienvenue sur O3 Store</h2>
        <p class="mt-4 text-lg text-primary-100">Decouvrez nos meilleurs produits</p>
        <router-link to="/shop" class="mt-6 inline-block rounded-xl bg-white px-7 py-3 text-sm font-semibold text-primary-700 hover:bg-gray-100 transition">
          Voir la boutique
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useImageUrl } from '@/composables/useImageUrl'

const props = defineProps({ slides: { type: Array, default: () => [] } })
const { imageUrl } = useImageUrl()

const current = ref(0)
let timer = null

onMounted(() => {
  if (props.slides.length > 1) {
    timer = setInterval(() => {
      current.value = (current.value + 1) % props.slides.length
    }, 5000)
  }
})

onUnmounted(() => clearInterval(timer))
</script>
