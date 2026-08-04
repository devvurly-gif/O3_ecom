# Récapitulatif — correction du storefront O3 (tenant Jadever)

Audit de `shop.jadema.o3app.ma` traité en 8 tâches. Tout est déployé et vérifié
en production.

Le storefront vit dans le dépôt **O3_ecom** (Vue 3, servi statiquement par
Nginx pour tous les `shop.*.o3app.ma`). Le dépôt **O3_app** héberge l'API
`/api/ecom` qui l'alimente. Deux tâches ont demandé des changements côté API.

---

## Tâches et fichiers

### T1 — Accents manquants `5b48b87` + `9a5b1fd` (O3_app)

Ce n'était **pas** un défaut d'encodage : fichiers en UTF-8 sans BOM, aucune
séquence de double-encodage. Les accents étaient simplement absents du code,
saisis en ASCII. 23 chaînes corrigées.

`HomePage` · `ShopPage` · `ProductPage` · `CartPage` · `CheckoutPage` ·
`ProductFilters` · `CategoryGrid` · `Navbar` · `HeroSlider` · `Footer`

En revanche, le bloc Nginx qui sert réellement la boutique n'avait **pas** de
`charset utf-8` — les réponses partaient en `text/html` nu, les accents ne
tenant qu'au `<meta charset>`. Corrigé sur le serveur et dans
`deployment/nginx/` pour qu'un redéploiement ne l'efface pas.

### T2 — Textes marketing `1a8be00` + `e98af54`

Textes de la home centralisés dans `src/config/content.js` (pas de vue-i18n :
une seule locale). Le hero de repli affichait « Bienvenue sur O3 Store » en
dur — la mauvaise enseigne sur Jadever ; il lit maintenant le nom réel.

**Données corrigées en base :** 6 champs de slides (dont « Prennez en
main » → « Prenez en main ») et 4 noms de catégories.

### T3 — Noms de produits EN → FR `c80f6f4`

96 produits publiés sur 163 portaient un nom anglais. **121 renommages**
appliqués directement dans `p_title`, contre l'avis initial de l'audit qui
proposait un champ `p_title_fr` avec repli : un champ parallèle aurait laissé
la recherche, le tri « Nom A-Z » et tout l'ERP en anglais.

Sûr parce que : `p_slug` n'est régénéré que s'il est vide (aucune URL cassée,
vérifié : 0 produit eCom sans slug), l'import Jadever saute les SKU existants,
et la clé fournisseur est `p_sku`.

### T3b — Descriptions techniques `7e2345c`

157 descriptions sur 177 contenaient de l'anglais. Traduites via un glossaire
déterministe construit sur le vocabulaire réellement présent (185 libellés,
125 expressions), appliqué du terme le plus long au plus court. **192 champs**
mis à jour. Balayage final : plus aucun mot anglais.

### T4 — « NON CATÉGORISÉ » `90c3ab9` (O3_app) + `e87c977`

Défaut de **données**, pas d'affichage : « Non catégorisé » est une vraie
catégorie créée à la naissance de chaque tenant. Corrigé côté **API** plutôt
que front — le storefront affiche déjà le badge sous `v-if="product.category"`,
il suffit de renvoyer `null` pour que carte et fiche suivent. Tous les tenants
en bénéficient.

`config/ecom.php` · `PromotionService` · `EcomCatalogueController` ·
`EcomPlaceholderLabelTest` (7 tests)

### T5 — Prix à 0,00 MAD `5849b6c` + `00875d6`

72 produits publiés sur 163 sans prix. Règle unique `isPurchasable`, partagée
par la carte, la fiche et le panier. Le panier **refuse** l'ajout quelle qu'en
soit l'origine et purge les articles sans prix enregistrés avant le correctif.

Bug trouvé en chemin : `/api/ecom/config` expose les coordonnées à deux
endroits, et sur Jadever seul `ecommerce.*` est renseigné — **le pied de page
n'affichait aucun contact** depuis toujours. Résolu dans `useShopContact`, qui
lit les deux sources.

### T6 — Devise `427f175`

**DH** retenu : l'ancien WooCommerce l'utilisait, Jadever l'écrit dans sa
propre bannière, et `MAD` est le code ISO bancaire. Symbole défini une seule
fois dans `content.js`. Trois libellés échappaient au formateur, dont une
remise en navbar affichée **sans aucune devise**.

### T7 — Écran figé au chargement `095f87b` + `e6c93fa`

L'app ne se montait qu'après `/config` : rien à l'écran avant 1,5 s, spinner
jusqu'à 5,2 s. Montage immédiat, boot loader supprimé, squelettes par section,
requêtes dédupliquées, images avec dimensions et chargement différé.

**Toutes les données reçues : 5209 ms → 1481 ms.** Images chargées d'emblée :
24 → 2.

### T8 — Page Boutique `eb648ed` + `f6e5db4`

Tri, filtres et pagination existaient déjà mais étaient bancals : la même
requête partait **deux fois** par clic, et le bouton **Retour renvoyait à
l'accueil** au lieu du filtre précédent. L'URL est devenue l'unique source de
vérité. Doublon de tri supprimé, filtres actifs retirables, pagination
complète.

---

## Ce qui reste à faire dans l'ERP

Ces points ne se corrigent pas dans le code. Ils sont chiffrés et listés.

| Sujet | Volume | Détail |
|-------|--------|--------|
| **Produits sans prix** | **72 / 163 publiés** | [T5-PRIX-MANQUANTS.md](T5-PRIX-MANQUANTS.md) — liste par catégorie avec id et SKU |
| **Produits non catégorisés** | **97** (81 publiés) | [T4-CATEGORISATION.md](T4-CATEGORISATION.md) — 24 rattachables sans arbitrage, 71 demandent 9 nouvelles catégories |
| **Titres non renseignés** | 2 | ids 169 (`JDLM1B283`) et 171 (`JDLWP5521`) — affichés `TITRE A COMPLETER` aux clients |
| **Titre ambigu** | 1 | id 66 `Brad cloueuse 2 en 1 combo 100 pcs Ga 18` |
| **Doublon de formulation** | 2 | ids 151/152, « Cloueur à finition » vs « de finition » |
| **Slide hero de 646 Ko** | 1 | plus lourd que tout le bundle ; les autres slides sont en WebP à 75 Ko |
| **Rattachements erronés** | 2 | « Disques diamant » ne contient qu'une clé à chocs ; « Échelles » contient un groupe électrogène |

Les 72 produits sans prix et les 2 titres vides sont les plus urgents : ce sont
les seuls visibles par un client comme un défaut.

---

## Recommandation SSR / pré-rendu : **non**

L'audit attribuait l'écran blanc à l'absence de SSR. Les mesures ont montré
autre chose — l'application s'interdisait de peindre — et le problème est réglé
sans toucher au modèle de déploiement.

Le storefront est **multi-tenant par sous-domaine générique** : un seul `dist`
statique pour tous les `shop.*.o3app.ma`, tenant déduit de
`window.location.hostname`. Donc :

- un **pré-rendu statique** serait juste pour un tenant et faux pour tous les
  autres ;
- un **SSR** imposerait un service Node par requête résolvant le tenant depuis
  l'en-tête `Host`, et toute la détection de tenant serait à réécrire.

Le seul argument restant est le **SEO**. Si cela devient un objectif
commercial, l'option la moins invasive n'est ni Nuxt ni un pré-rendu global,
mais un **rendu à la demande réservé aux robots** (détection `User-Agent` côté
Nginx, service headless mis en cache) : le site reste statique pour les
humains, rien ne change au déploiement.

À arbitrer sur des objectifs chiffrés, pas par principe. Raisonnement complet
dans [T7-PERFORMANCE.md](T7-PERFORMANCE.md).

---

## Pistes techniques restantes, par gain

1. **Slide hero à reconvertir en WebP** — ~570 Ko sur le chemin critique.
2. **Remplacer axios par `fetch`** — 42 Ko gzip pour six GET JSON, c'est le
   plus gros morceau du bundle.
3. **Variantes d'images côté ERP** — sans elles, `srcset` n'apporte rien. Le
   logo est servi en 246×205 pour un affichage 34×34.
4. **Filtre de disponibilité** — l'API n'expose pas le stock en critère ; il est
   calculé par un accesseur, pas par une colonne.
5. **Nettoyer les configurations Nginx** — trois blocs matchent `shop.*`, dont
   un mort et un fichier legacy qui provoque un avertissement au démarrage.
