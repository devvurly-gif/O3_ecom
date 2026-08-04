<template>
  <div class="mx-auto max-w-9xl px-4 sm:px-6 lg:px-2 py-2 sm:py-2">
    <!-- Header -->
    <div class="flex p-2">
      <h1 class="text-2xl sm:text-3xl text-ink flex-1">Boutique</h1>
      <p v-if="store.pagination.total" class="text-lg text-neutral-600 pt-4">
        {{ store.pagination.total }} produit{{ store.pagination.total > 1 ? 's' : '' }}
      </p>
    </div>
    <hr class="hr mb-10" />

    <div class="flex flex-col lg:flex-row gap-10" style="padding-top: 0.5rem;">
      <!-- Sidebar filters -->
      <div class="w-full lg:w-64 shrink-0">
        <ProductFilters
          :categories="categoryStore.categories"
          :selected-category="filtres.category_id"
          :brands="brandStore.brands"
          :selected-brand="filtres.brand_id"
          :price-min="filtres.price_min"
          :price-max="filtres.price_max"
          :sort-by="filtres.sort"
          :has-search="!!filtres.search"
          @filter-category="(v) => appliquer({ category: v, page: 1 })"
          @filter-brand="(v) => appliquer({ brand: v, page: 1 })"
          @filter-price="({ min, max }) => appliquer({ price_min: min, price_max: max, page: 1 })"
          @sort="(v) => appliquer({ sort: v, page: 1 })"
        />
      </div>

      <!-- Products -->
      <div class="flex-1">
        <!-- Filtres actifs : sans ce rappel, un client arrivé par la recherche
             ou par un lien de catégorie ne voit pas pourquoi la liste est
             réduite, ni comment revenir au catalogue complet. -->
        <div v-if="filtresActifs.length" class="mb-6 flex flex-wrap items-center gap-2">
          <span class="text-sm text-neutral-600">Filtres actifs :</span>
          <button
            v-for="f in filtresActifs"
            :key="f.cle"
            type="button"
            class="tag tag-outline inline-flex items-center gap-1.5 hover:bg-neutral-100"
            @click="retirer(f)"
          >
            {{ f.libelle }}
            <XMarkIcon class="h-3.5 w-3.5" />
          </button>
          <button type="button" class="btn-ghost text-sm font-bold" @click="toutReinitialiser">
            Tout effacer
          </button>
        </div>

        <ProductGridSkeleton v-if="store.loading" :count="12" />
        <template v-else>
          <ProductGrid v-if="store.products.length" :products="store.products" />
          <div v-else class="flex flex-col items-center justify-center py-20 text-center">
            <MagnifyingGlassIcon class="h-12 w-12 text-neutral-400" />
            <p class="mt-4 text-neutral-600">Aucun produit trouvé</p>
            <button @click="toutReinitialiser" class="btn-ghost mt-4 font-bold text-sm">
              Réinitialiser les filtres
            </button>
          </div>
          <Pagination
            :current-page="store.pagination.currentPage"
            :last-page="store.pagination.lastPage"
            @change-page="(p) => appliquer({ page: p })"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '@/stores/productStore'
import { useCategoryStore } from '@/stores/categoryStore'
import { useBrandStore } from '@/stores/brandStore'
import ProductGrid from '@/components/product/ProductGrid.vue'
import ProductFilters from '@/components/product/ProductFilters.vue'
import Pagination from '@/components/ui/Pagination.vue'
import ProductGridSkeleton from '@/components/ui/ProductGridSkeleton.vue'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const store = useProductStore()
const categoryStore = useCategoryStore()
const brandStore = useBrandStore()

const PAR_PAGE = 12

/**
 * L'URL est l'unique source de vérité.
 *
 * Auparavant, chaque action écrivait l'URL *et* déclenchait le chargement,
 * pendant qu'un watcher sur la query déclenchait un second chargement : la
 * même requête partait deux fois à chaque clic. Ici, les actions ne font
 * qu'écrire l'URL ; le watcher est le seul à charger.
 *
 * `push` et non `replace` : avec `replace`, le bouton Retour depuis
 * /shop?category=6 renvoyait directement à l'accueil au lieu de revenir au
 * filtre précédent, et l'état était perdu.
 */
const filtres = computed(() => ({
  search: route.query.search || '',
  category_id: route.query.category ? Number(route.query.category) : null,
  brand_id: route.query.brand ? Number(route.query.brand) : null,
  price_min: route.query.price_min ? Number(route.query.price_min) : null,
  price_max: route.query.price_max ? Number(route.query.price_max) : null,
  sort: route.query.sort || '',
  page: route.query.page ? Number(route.query.page) : 1,
}))

function appliquer(modifs) {
  const query = { ...route.query }

  for (const [cle, valeur] of Object.entries(modifs)) {
    // null / '' / 1re page : on retire la clé plutôt que de polluer l'URL.
    if (valeur === null || valeur === '' || valeur === undefined || (cle === 'page' && valeur === 1)) {
      delete query[cle]
    } else {
      query[cle] = String(valeur)
    }
  }

  // Changer un filtre doit ramener en page 1, sinon on atterrit sur une page
  // qui n'existe plus dans le nouveau résultat.
  if (!('page' in modifs)) delete query.page

  // Naviguer vers une URL identique lève une erreur bénigne dans vue-router.
  router.push({ query }).catch(() => {})
}

function chargerDepuisUrl() {
  const f = filtres.value
  const params = { per_page: PAR_PAGE, page: f.page }
  if (f.search) params.search = f.search
  if (f.category_id) params.category_id = f.category_id
  if (f.brand_id) params.brand_id = f.brand_id
  if (f.price_min != null) params.price_min = f.price_min
  if (f.price_max != null) params.price_max = f.price_max
  if (f.sort) params.sort = f.sort
  store.fetchProducts(params)
}

const nomCategorie = (id) => categoryStore.categories.find((c) => c.id === id)?.name
const nomMarque = (id) => brandStore.brands.find((b) => b.id === id)?.name

const filtresActifs = computed(() => {
  const f = filtres.value
  const actifs = []
  if (f.search) actifs.push({ cle: 'search', libelle: `Recherche : « ${f.search} »` })
  if (f.category_id) actifs.push({ cle: 'category', libelle: nomCategorie(f.category_id) || 'Catégorie' })
  if (f.brand_id) actifs.push({ cle: 'brand', libelle: nomMarque(f.brand_id) || 'Marque' })
  if (f.price_min != null || f.price_max != null) {
    actifs.push({
      cle: 'prix',
      libelle: `Prix ${f.price_min ?? 0} – ${f.price_max ?? '∞'}`,
      cles: ['price_min', 'price_max'],
    })
  }
  return actifs
})

function retirer(filtre) {
  const modifs = {}
  for (const cle of filtre.cles ?? [filtre.cle]) modifs[cle] = null
  appliquer({ ...modifs, page: 1 })
}

function toutReinitialiser() {
  router.push({ query: {} }).catch(() => {})
}

// Seul point de chargement : toute navigation (clic, Retour, Suivant, lien
// partagé) passe par là.
watch(() => route.query, chargerDepuisUrl, { immediate: true, deep: true })

// Sur changement de page, remonter : rester au milieu de la liste après un
// changement de page est désorientant.
watch(() => filtres.value.page, () => window.scrollTo({ top: 0, behavior: 'smooth' }))

categoryStore.fetchCategories()
brandStore.fetchBrands()
</script>
