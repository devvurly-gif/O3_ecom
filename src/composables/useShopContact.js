import { inject, computed } from 'vue'

/**
 * Coordonnées de la boutique, résolues depuis /api/ecom/config.
 *
 * La configuration expose les mêmes informations à deux endroits : `shop.*`
 * (fiche d'identité du tenant) et `ecommerce.*` (réglages de la boutique). Sur
 * Jadever, `shop.phone` et `shop.email` sont nuls alors que `ecommerce.phone`
 * et `ecommerce.email` sont renseignés — le pied de page n'affichait donc aucun
 * moyen de contact. On lit les deux, `shop` d'abord.
 */
export function useShopContact() {
  const config = inject('shopConfig', {})

  const shop = computed(() => config?.shop ?? {})
  const ecom = computed(() => config?.ecommerce ?? {})

  const phone = computed(() => shop.value.phone || ecom.value.phone || null)
  const email = computed(() => shop.value.email || ecom.value.email || null)
  const address = computed(() => shop.value.address || ecom.value.address || null)
  const whatsapp = computed(() => ecom.value.whatsapp_number || null)

  /**
   * Meilleur canal pour demander un prix, dans l'ordre : WhatsApp (le plus
   * utilisé au Maroc, et on peut pré-remplir le message avec le produit),
   * puis téléphone, puis e-mail. Null si rien n'est renseigné, pour ne pas
   * afficher un bouton mort.
   */
  function demandeDePrix(nomProduit) {
    const objet = `Bonjour, je souhaite connaître le prix de : ${nomProduit}`

    if (whatsapp.value) {
      const numero = String(whatsapp.value).replace(/[^\d]/g, '')
      return `https://wa.me/${numero}?text=${encodeURIComponent(objet)}`
    }
    if (phone.value) return `tel:${String(phone.value).replace(/\s+/g, '')}`
    if (email.value) return `mailto:${email.value}?subject=${encodeURIComponent(objet)}`
    return null
  }

  return { phone, email, address, whatsapp, demandeDePrix }
}
