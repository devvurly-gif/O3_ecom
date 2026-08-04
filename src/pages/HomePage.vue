<template>
  <div>
    <!-- Chaque section affiche son propre squelette et se révèle dès que SES
         données arrivent, sans attendre les autres : le hero n'est plus retenu
         par la grille de catégories. -->

    <!-- 1. Hero -->
    <HeroSkeleton v-if="chargement.slides" />
    <HeroSlider v-else :slides="promoStore.slides" />

    <hr class="hr" />

    <!-- 2. Nouveautés -->
    <template v-if="chargement.nouveautes">
      <SectionRailSkeleton />
    </template>
    <NewArrivals
      v-else-if="newProducts.length"
      :title="content.home.newArrivals.title"
      :subtitle="content.home.newArrivals.subtitle"
      :products="newProducts"
      :link="{ name: 'shop', query: { sort: 'newest' } }"
    />

    <hr class="hr" />

    <!-- 3. Promotions -->
    <PromoSection :promotions="promoStore.promotions" />

    <hr class="hr" />

    <template v-if="chargement.promos">
      <SectionRailSkeleton />
    </template>
    <FeaturedProducts
      v-else-if="promoProducts.length"
      :title="content.home.promoProducts.title"
      :subtitle="content.home.promoProducts.subtitle"
      :products="promoProducts"
      link="/promotions"
    />

    <hr class="hr" />

    <CategoryGridSkeleton v-if="chargement.categories" />
    <CategoryGrid v-else :categories="categoryStore.categories" />
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import api from '@/api/axios'
import { useCategoryStore } from '@/stores/categoryStore'
import { usePromoStore } from '@/stores/promoStore'
import HeroSlider from '@/components/home/HeroSlider.vue'
import CategoryGrid from '@/components/home/CategoryGrid.vue'
import NewArrivals from '@/components/home/NewArrivals.vue'
import FeaturedProducts from '@/components/home/FeaturedProducts.vue'
import PromoSection from '@/components/home/PromoSection.vue'
import HeroSkeleton from '@/components/ui/HeroSkeleton.vue'
import SectionRailSkeleton from '@/components/ui/SectionRailSkeleton.vue'
import CategoryGridSkeleton from '@/components/ui/CategoryGridSkeleton.vue'
import { content } from '@/config/content'

const categoryStore = useCategoryStore()
const promoStore = usePromoStore()

const newProducts = ref([])
const promoProducts = ref([])

const chargement = reactive({
  slides: true,
  nouveautes: true,
  promos: true,
  categories: true,
})

function liste(reponse) {
  // La réponse est soit paginée ({ data: [] }), soit déjà déballée ([]).
  return Array.isArray(reponse.data) ? reponse.data : (reponse.data?.data ?? [])
}

// Volontairement pas de Promise.all ni de await global : chaque section se
// débloque à son propre rythme. Le lancement est immédiat (pas dans onMounted)
// pour ne pas perdre un tick de plus avant le premier octet.
api.get('/products', { params: { new: true, per_page: 12 } })
  .then((r) => { newProducts.value = liste(r) })
  .catch((e) => console.error('Nouveautés :', e))
  .finally(() => { chargement.nouveautes = false })

api.get('/products', { params: { promo: true, per_page: 8 } })
  .then((r) => { promoProducts.value = liste(r) })
  .catch((e) => console.error('Promotions :', e))
  .finally(() => { chargement.promos = false })

categoryStore.fetchCategories().finally(() => { chargement.categories = false })
promoStore.fetchSlides().finally(() => { chargement.slides = false })
promoStore.fetchPromotions()
</script>
