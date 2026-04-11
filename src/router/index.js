import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/HomePage.vue'),
  },
  {
    path: '/shop',
    name: 'shop',
    component: () => import('@/pages/ShopPage.vue'),
  },
  {
    path: '/product/:slug',
    name: 'product',
    component: () => import('@/pages/ProductPage.vue'),
    props: true,
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('@/pages/CartPage.vue'),
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('@/pages/CheckoutPage.vue'),
  },
  {
    path: '/promotions',
    name: 'promotions',
    component: () => import('@/pages/PromotionPage.vue'),
  },
  {
    path: '/promotions/:slug',
    name: 'promotion',
    component: () => import('@/pages/PromotionPage.vue'),
    props: true,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

// ── Route loading bar ─────────────────────────────
// Inject a thin progress bar at the top of the page during route transitions.
const bar = document.createElement('div')
bar.id = 'route-progress'
bar.style.cssText = 'position:fixed;top:0;left:0;height:3px;background:#2563eb;z-index:9999;transition:width .3s ease;width:0;pointer-events:none;'
document.body.prepend(bar)

router.beforeEach(() => {
  bar.style.transition = 'width .3s ease'
  bar.style.width = '70%'
  bar.style.opacity = '1'
})

router.afterEach(() => {
  bar.style.width = '100%'
  setTimeout(() => {
    bar.style.transition = 'opacity .3s ease'
    bar.style.opacity = '0'
    setTimeout(() => { bar.style.width = '0' }, 300)
  }, 150)
})

export default router
