/**
 * Textes de l'interface du storefront.
 *
 * Point d'entrée unique pour toute chaîne de caractères visible qui n'est PAS
 * une donnée du catalogue. Les noms de produits, catégories, marques, slides et
 * promotions viennent de l'API (module marketing de l'ERP) et ne se corrigent
 * donc pas ici — voir docs/AUDIT-DONNEES.md.
 *
 * Le storefront ne sert que le français : pas de vue-i18n, une dépendance de
 * plus pour une seule locale. Ce module garde la même forme qu'un catalogue de
 * messages, l'ajout d'une seconde langue se ferait sans toucher aux composants.
 */
export const content = {
  common: {
    seeAll: 'Voir tout',
  },

  /**
   * Devise affichée aux clients.
   *
   * « DH » plutôt que « MAD » : c'est ce qu'utilisait l'ancienne boutique
   * WooCommerce, c'est ce que Jadever écrit dans sa propre bannière
   * (« Livraison gratuite pour 5000DH »), et c'est ce qu'un client marocain lit
   * sur une étiquette. « MAD » est le code ISO 4217, réservé aux échanges
   * bancaires et aux données.
   *
   * Changer `symbol` ici suffit à changer l'affichage partout.
   */
  currency: {
    code: 'MAD',
    symbol: 'DH',
  },

  /** Produits dont le prix n'est pas encore saisi dans l'ERP. */
  price: {
    onRequest: 'Prix sur demande',
    contactCta: 'Nous consulter',
    cartBlocked: 'Prix sur demande',
    cardHint: 'Contactez-nous pour un tarif',
  },

  /** Affiché uniquement quand aucun slide n'est configuré dans l'ERP. */
  hero: {
    // Le nom réel de la boutique vient de /api/ecom/config : sur un tenant
    // comme Jadever, un « O3 Store » en dur afficherait la mauvaise enseigne.
    fallbackTitle: (shopName) => `Bienvenue sur ${shopName}`,
    fallbackSubtitle: 'Découvrez nos meilleurs produits',
    fallbackCta: 'Voir la boutique',
  },

  home: {
    newArrivals: {
      title: 'Nouveautés',
      subtitle: 'Les derniers produits ajoutés',
    },
    promoProducts: {
      title: 'Offres spéciales',
      subtitle: 'Produits en promotion',
    },
    categories: {
      title: 'Nos catégories',
      subtitle: 'Explorez nos différentes catégories de produits',
    },
    promoBanner: {
      eyebrow: 'Promotions',
      title: 'Profitez de nos offres exclusives',
      count: (n) => `${n} promotion${n > 1 ? 's' : ''} en cours.`,
      cta: 'Voir toutes les promotions',
    },
  },

  footer: {
    tagline: 'Votre boutique en ligne pour les meilleurs produits au Maroc.',
  },
}

export default content
