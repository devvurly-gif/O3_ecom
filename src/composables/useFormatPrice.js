import { content } from '@/config/content'

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

// Mise en forme du nombre seul. `style: 'currency'` imposerait « MAD », le code
// ISO, alors que la boutique affiche « DH » ; le rendu numérique est identique
// dans les deux styles pour fr-MA (2.976,00), seul le suffixe change.
const nombre = new Intl.NumberFormat('fr-MA', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** Symbole affiché aux clients, décidé une seule fois dans content.js. */
export const currencySymbol = content.currency.symbol

/**
 * « 2.976,00 DH ». Espace insécable : le montant et sa devise ne doivent
 * jamais se retrouver sur deux lignes.
 */
export function formatPrice(price) {
  return `${nombre.format(price ?? 0)} ${currencySymbol}`
}

export function useFormatPrice() {
  return { formatPrice, currencySymbol, hasPrice, effectivePrice, isPurchasable }
}
