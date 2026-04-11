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

  const totalPrice = computed(() =>
    items.value.reduce((sum, i) => sum + i.price * i.quantity, 0)
  )

  function addItem(product, qty = 1) {
    const existing = items.value.find(i => i.id === product.id)
    if (existing) {
      existing.quantity += qty
    } else {
      items.value.push({
        id: product.id,
        title: product.title,
        slug: product.slug,
        price: product.has_promo ? product.promo_price_ttc : product.price_ttc,
        originalPrice: product.price_ttc,
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
    addItem, updateQuantity, removeItem, clearCart,
  }
})
