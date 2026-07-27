import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'o3_cart'

function loadCart() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] }
  catch { return [] }
}

export const useCartStore = defineStore('cart', () => {
  const items = ref(loadCart())
  const drawerOpen = ref(false)

  watch(items, (val) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
  }, { deep: true })

  const totalItems = computed(() => items.value.reduce((sum, i) => sum + i.quantity, 0))

  function itemPrice(item) {
    // If variant has its own price, use it
    if (item.variant_price != null) return item.variant_price
    return item.has_promo && item.promo_price_ttc != null ? item.promo_price_ttc : item.price_ttc
  }

  const totalPrice = computed(() =>
    items.value.reduce((sum, i) => sum + itemPrice(i) * i.quantity, 0)
  )

  // Unique cart key = product id + variant id (null for no variant)
  function cartKey(productId, variantId = null) {
    return `${productId}-${variantId ?? 'base'}`
  }

  function addItem(product, qty = 1, variant = null) {
    const key = cartKey(product.id, variant?.id ?? null)
    const existing = items.value.find(i => i._key === key)

    if (existing) {
      existing.quantity += qty
      existing.price_ttc = product.price_ttc
      existing.promo_price_ttc = product.promo_price_ttc ?? null
      existing.has_promo = !!product.has_promo
    } else {
      items.value.push({
        _key:           key,
        id:             product.id,
        title:          product.title,
        slug:           product.slug,
        price_ttc:      product.price_ttc,
        promo_price_ttc: product.promo_price_ttc ?? null,
        has_promo:      !!product.has_promo,
        image:          product.image || product.images?.[0]?.url || product.images?.[0] || null,
        quantity:       qty,
        // Variant fields
        variant_id:     variant?.id ?? null,
        variant_label:  variant?.label ?? null,
        variant_sku:    variant?.sku ?? null,
        variant_price:  variant?.price_ttc ?? null,
      })
    }
    drawerOpen.value = true
  }

  function updateQuantity(key, qty) {
    const item = items.value.find(i => i._key === key)
    if (item) {
      if (qty <= 0) removeItem(key)
      else item.quantity = qty
    }
  }

  function removeItem(key) {
    items.value = items.value.filter(i => i._key !== key)
  }

  function clearCart() { items.value = [] }

  return {
    items, drawerOpen, totalItems, totalPrice,
    addItem, updateQuantity, removeItem, clearCart, itemPrice, cartKey,
  }
})
