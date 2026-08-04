# T7 — Performance et rendu au chargement

## Le diagnostic ne collait pas à l'hypothèse

L'audit attribuait l'écran quasi blanc à l'absence de SSR. Les mesures disent
autre chose : **l'application refusait délibérément de s'afficher.**

`main.js` n'appelait `app.mount()` que dans le `.finally()` de la requête
`/config`, et un boot loader plein écran recouvrait la page jusqu'à ce que
*toutes* les données de l'accueil soient arrivées (ou 8 s, au choix).

Chronologie mesurée en production, avant correction :

| Étape | Temps |
|-------|-------|
| DOM prêt | 604 ms |
| `/config` — bloque le montage | 599 → **1483 ms** |
| Données de l'accueil (démarrent seulement ensuite) | 1943 → **5209 ms** |

Une chaîne strictement sérialisée : HTML → JS → `/config` → montage → données.
Aucun SSR n'aurait corrigé ça, parce que le problème n'est pas le premier
rendu HTML mais le fait que le client s'interdise de peindre.

## Ce qui a été corrigé

**Montage immédiat.** `shopConfig` est un objet réactif fourni avant le
montage puis rempli à l'arrivée de la réponse. Navbar, Footer et
`useShopContact` le lisent déjà au travers d'un `computed` : ils se mettent à
jour seuls, sans modification.

**Boot loader supprimé.** Il n'existait que pour masquer une application non
montée ; il transformait un retard réseau en écran figé de plusieurs secondes.

**Squelettes par section.** Chaque bloc de l'accueil affiche un gabarit aux
dimensions du contenu réel et se révèle dès que *ses* données arrivent — le
hero n'est plus retenu par la grille de catégories. Plus de `Promise.all`
global. Les squelettes respectent `prefers-reduced-motion`.

**Requêtes dédupliquées.** La navbar et l'accueil demandaient catégories et
promotions dans le même tick ; le garde « si déjà chargé, on sort » ne voyait
rien puisque aucune des deux n'avait encore de résultat. Les stores conservent
désormais la promesse en cours. 8 requêtes → 6.

**Images.** Dimensions explicites sur les 25 images (la place est réservée, plus
de sauts de mise en page), chargement différé partout sauf sur l'élément LCP —
premier slide et image principale de la fiche produit — qui passe en
`fetchpriority="high"`.

## Résultat mesuré

| | Avant | Après |
|---|-------|-------|
| Requêtes API au chargement | 8 (2 doublons) | **6** |
| Début des requêtes de données | 1943 ms | **~505 ms** |
| Toutes les données reçues | 5209 ms | **1481 ms** / 2069 ms (2 mesures) |
| Images chargées d'emblée | 24 | **2** (les autres au défilement) |
| Images avec dimensions | 0 / 25 | **25 / 25** |
| Écran figé | jusqu'à 5,2 s | aucun — squelettes immédiats |

Deux mesures ont été prises pour ne pas conclure sur un aléa réseau. Le gain
n'est pas qu'un chiffre : la chaîne était sérialisée, elle est maintenant
parallèle.

---

## Recommandation : ne pas passer à SSR / SSG

C'est la question posée par l'audit. **Réponse : non**, et pas seulement parce
que c'est coûteux.

### L'architecture s'y prête mal

Le storefront est **multi-tenant par sous-domaine générique** : un seul `dist`
statique servi par Nginx pour tous les `shop.*.o3app.ma`. Le tenant est déduit
à l'exécution de `window.location.hostname` (`api/axios.js`), et chaque tenant
a son propre catalogue, son logo, ses couleurs.

Conséquences directes :

- **Un pré-rendu statique n'a pas de sens.** Une home pré-rendue serait juste
  pour un tenant et fausse pour tous les autres. Il faudrait pré-rendre N fois
  et router par hôte — soit N builds à régénérer à chaque changement de
  catalogue.
- **Le SSR demanderait un processus Node par requête**, résolvant le tenant
  depuis l'en-tête `Host`, avec sa propre clé d'API, son cache et sa
  supervision. On remplacerait un fichier statique servi par Nginx par un
  service applicatif à exploiter.
- `window.location.hostname` n'existe pas côté serveur : toute la détection de
  tenant serait à réécrire.

### Le gain attendu a déjà été obtenu autrement

Le SSR aurait servi à ne plus montrer d'écran vide. C'est fait, pour environ
50 lignes, sans changer le modèle de déploiement.

### Ce qu'il resterait à gagner : le SEO

C'est le seul argument qui tienne encore. Les moteurs exécutent le JavaScript,
mais avec un délai et un budget d'exploration réduits ; une boutique rendue
côté client est désavantagée sur des pages produit.

**Si le référencement devient un objectif commercial**, l'option la moins
invasive n'est ni Nuxt ni un pré-rendu : c'est un **pré-rendu à la demande
côté Nginx pour les robots uniquement** — détecter le `User-Agent` des
crawlers et servir une version rendue par un service headless mis en cache.
Le site reste une SPA statique pour les humains, rien ne change au
déploiement, et seuls les robots paient le coût du rendu.

Cela reste un projet à part entière, pas une tâche de correction. À arbitrer
sur des objectifs SEO chiffrés, pas par principe.

---

## Ce qui reste à faire, par ordre de gain

### 1. Un slide hero de 646 Ko (donnée)

`slide-1785278797-6a69314d99fb5.jpg` — 1920×1100, **646 Ko**. C'est l'élément
LCP, et il pèse **plus lourd que tout le bundle JS + CSS réuni** (277 Ko).

Les deux autres slides sont déjà en WebP à ~75 Ko : l'ERP sait convertir, ce
fichier est simplement passé au travers. Le reconvertir en WebP ferait gagner
environ **570 Ko sur le chemin critique** — de loin le meilleur rapport
effort/gain restant.

### 2. axios : 42 Ko gzip pour six requêtes GET

`axios` est le plus gros morceau du bundle (105 Ko bruts, 42 Ko gzip), plus
lourd que l'application elle-même. Le storefront ne fait que des GET/POST JSON
avec un en-tête fixe : `fetch` couvre le besoin. Le remplacer supprimerait
~42 Ko gzip du chargement initial. Refonte de `api/axios.js` et des cinq
stores — mécanique, mais à faire d'un bloc.

### 3. Images non redimensionnées

Aucune image n'a de `srcset`, faute de variantes : l'API ne sert qu'une taille.

- logo : servi en 246×205 pour un affichage **34×34**
- vignettes produit : servies en 500×500 pour un affichage **274×274**
- slides : servis en 1920×1100 pour un affichage 1265×500

Un `srcset` utile suppose que l'ERP génère des vignettes à l'upload. C'est un
travail côté backend, sans quoi ajouter `srcset` n'apporterait rien.
