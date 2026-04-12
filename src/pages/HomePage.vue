<template>
  <div>
    <HeroSlider :slides="promoStore.slides" />

    <FeaturedProducts
      v-if="newProducts.length"
      title="Nouveautes"
      subtitle="Les derniers produits ajoutes"
      :products="newProducts"
      :link="{ name: 'shop', query: { sort: 'newest' } }"
    />

    <CategoryGrid :categories="categoryStore.categories" />

    <PromoSection :promotions="promoStore.promotions" />

    <FeaturedProducts
      v-if="promoProducts.length"
      title="Offres speciales"
      subtitle="Produits en promotion"
      :products="promoProducts"
      link="/promotions"
    />

    <LoadingSpinner v-if="loading" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/axios'
import { useCategoryStore } from '@/stores/categoryStore'
import { usePromoStore } from '@/stores/promoStore'
import HeroSlider from '@/components/home/HeroSlider.vue'
import CategoryGrid from '@/components/home/CategoryGrid.vue'
import FeaturedProducts from '@/components/home/FeaturedProducts.vue'
import PromoSection from '@/components/home/PromoSection.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const categoryStore = useCategoryStore()
const promoStore = usePromoStore()

const newProducts = ref([])
const promoProducts = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const [newRes, promoRes] = await Promise.all([
      api.get('/products', { params: { new: true, per_page: 8 } }),
      api.get('/products', { params: { promo: true, per_page: 8 } }),
      categoryStore.fetchCategories(),
      promoStore.fetchPromotions(),
      promoStore.fetchSlides(),
    ])
    // Response may be paginated ({ data: [], current_page }) or unwrapped ([])
    newProducts.value = Array.isArray(newRes.data) ? newRes.data : (newRes.data?.data ?? [])
    promoProducts.value = Array.isArray(promoRes.data) ? promoRes.data : (promoRes.data?.data ?? [])
  } catch (e) {
    console.error('Failed to load home data:', e)
  } finally {
    loading.value = false
  }
})
</script>
