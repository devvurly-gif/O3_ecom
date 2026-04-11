import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'o3_cart'

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  } catch {
    return []
  }
}

export const useCartStore = defineStore('cart', () => {
  const items = ref(loadCart())
  const drawerOpen = ref(false)

  watch(items, (val) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
  }, { deep: true })

  const totalItems = computed(() =>
    items.value.reduce((sum, i) => sum + i.quantity, 0)
  )

  function itemPrice(item) {
    return item.has_promo && item.promo_price_ttc != null ? item.promo_price_ttc : item.price_ttc
  }

  const totalPrice = computed(() =>
    items.value.reduce((sum, i) => sum + itemPrice(i) * i.quantity, 0)
  )

  function addItem(product, qty = 1) {
    const existing = items.value.find(i => i.id === product.id)
    if (existing) {
      existing.quantity += qty
      // Refresh price data in case promo status changed
      existing.price_ttc = product.price_ttc
      existing.promo_price_ttc = product.promo_price_ttc ?? null
      existing.has_promo = !!product.has_promo
    } else {
      items.value.push({
        id: product.id,
        title: product.title,
        slug: product.slug,
        price_ttc: product.price_ttc,
        promo_price_ttc: product.promo_price_ttc ?? null,
        has_promo: !!product.has_promo,
        image: product.image || product.images?.[0]?.url || product.images?.[0] || null,
        quantity: qty,
      })
    }
    drawerOpen.value = true
  }

  function updateQuantity(id, qty) {
    const item = items.value.find(i => i.id === id)
    if (item) {
      if (qty <= 0) {
        removeItem(id)
      } else {
        item.quantity = qty
      }
    }
  }

  function removeItem(id) {
    items.value = items.value.filter(i => i.id !== id)
  }

  function clearCart() {
    items.value = []
  }

  return {
    items, drawerOpen, totalItems, totalPrice,
    addItem, updateQuantity, removeItem, clearCart, itemPrice,
  }
})
