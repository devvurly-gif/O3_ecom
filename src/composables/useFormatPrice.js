/**
 * Autorité unique sur les prix du storefront : mise en forme ET disponibilité.
 *
 * Un prix nul ou absent ne veut jamais dire « gratuit » : il veut dire « pas
 * encore saisi dans l'ERP ». Afficher « 0,00 MAD » à un client est faux et
 * laisse ajouter au panier un produit qu'on ne sait pas facturer. La règle est
 * donc partagée par la carte produit, la fiche et le panier — un seul endroit
 * à changer si la définition évolue.
 */

/** Le produit a-t-il un prix réellement exploitable ? */
export function hasPrice(value) {
  return typeof value === 'number' && Number.isFinite(value) && value > 0
}

/**
 * Prix applicable : celui de la variante si elle en porte un, sinon le prix
 * promotionnel, sinon le prix courant. Même arbitrage partout.
 */
export function effectivePrice(product, variant = null) {
  if (!product) return null
  if (variant && variant.price_ttc != null) return variant.price_ttc
  return product.has_promo && product.promo_price_ttc != null
    ? product.promo_price_ttc
    : product.price_ttc
}

/** Le produit est-il vendable en ligne (prix connu) ? */
export function isPurchasable(product, variant = null) {
  return hasPrice(effectivePrice(product, variant))
}

export function useFormatPrice() {
  function formatPrice(price) {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 2,
    }).format(price ?? 0)
  }

  return { formatPrice, hasPrice, effectivePrice, isPurchasable }
}
