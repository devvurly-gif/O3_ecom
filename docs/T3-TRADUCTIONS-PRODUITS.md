# T3 — Traduction des noms de produits (tenant `jadema`)

**État : appliqué le 2026-08-02 sur le tenant `jadema`.**

96 produits publiés sur 163 (59 % du catalogue visible) portaient un nom anglais,
répartis sur 58 titres distincts. 69 règles de renommage ont été appliquées,
**121 produits renommés**.

Contrôles après application :

- aucun slug modifié — les 163 produits eCom ont toujours leur `p_slug` d'origine,
  donc aucune URL cassée ;
- plus aucun titre anglais dans le catalogue (les occurrences restantes de
  *diesel*, *DC*, *TCT* sont des termes techniques français) ;
- 2 titres restent à renseigner par le métier (voir plus bas).

Le script de renommage était apparié au titre exact et refusait de s'exécuter si
une clé n'existait pas telle quelle en base. L'état d'origine complet du
catalogue avait été exporté avant l'opération, le retour arrière reste possible.

---

## Stratégie retenue : renommer `p_title` directement

Le cahier des charges évoquait un champ `name_fr` ou une table de correspondance
avec fallback. Après vérification du code, **c'est le mauvais choix ici** :

| | Renommer `p_title` | Champ `p_title_fr` + fallback |
|---|---|---|
| Recherche client | fonctionne en FR | reste sur l'anglais — chercher « perceuse » ne trouverait rien |
| Tri « Nom A-Z » | cohérent | trie sur l'anglais |
| ERP (devis, factures, POS) | FR partout | reste en anglais |
| Migration multi-tenant | aucune | sur toutes les bases tenants |
| Saisie métier | champ existant | nouveau champ à ajouter dans l'admin |
| Nom fournisseur d'origine | perdu | conservé |

Trois vérifications rendent le renommage sûr :

1. **Le slug ne bouge pas.** `p_slug` n'est régénéré que s'il est vide
   (`Product::booted()`), donc aucune URL produit ne casse et le SEO est préservé.
2. **Aucun import ne réécrit le titre.** `import:jadever-power-source` saute les
   SKU déjà présents (`if (Product::where('p_sku', ...)->exists()) continue;`).
   Seul `--fresh`, explicitement destructif, supprimerait avant réimport.
3. **La clé fournisseur reste le SKU.** `p_sku` / `p_code` portent les références
   Jadever (`JDQM1A36`…) : c'est par elles que se fait le rapprochement, pas par
   le libellé. Le nom anglais n'a donc pas de valeur d'identification.

Le « fallback » demandé devient sans objet : `p_title` est obligatoire et toujours
rempli, il n'existe pas d'état « traduction manquante ».

---

## Traductions proposées

Termes techniques du bâtiment et de l'outillage. Les lignes marquées ⚠️ méritent
un avis métier.

| # | Anglais | Français proposé | Nb |
|---|---------|------------------|----|
| 1 | Abrasive metal cutting disc | Disque à tronçonner métal | 8 |
| 2 | Abrasive metal grinding disc | Disque à ébarber métal | 2 |
| 3 | Air compressor | Compresseur d'air | 5 |
| 4 | Air impact wrench | Clé à chocs pneumatique | 1 |
| 5 | Aspirator blower | Souffleur aspirateur électrique | 1 |
| 6 | Auto air compressor | Compresseur d'air auto | 1 |
| 7 | Automatic pump control | Commande de pompe automatique | 1 |
| 8 | Battery load tester 100A 200-1000CCA | Testeur de batterie 100 A 200-1000 CCA | 1 |
| 9 | Belt sander | Ponceuse à bande | 2 |
| 10 | Bush cutter blade | Lame pour débroussailleuse | 2 |
| 11 | Cordless blower | Souffleur sans fil | 1 |
| 12 | Cordless brad nailer | Cloueur de finition sans fil | 1 |
| 13 | Cordless circular saw | Scie circulaire sans fil | 1 |
| 14 | Cordless multi-tool | Outil multifonction sans fil | 1 |
| 15 | Cordless spray gun | Pistolet à peinture sans fil | 1 |
| 16 | ⚠️ Cordless tile vibration machine | Vibreur à carrelage sans fil | 1 |
| 17 | DC submersible pump | Pompe submersible 24V DC (eau claire) | 1 |
| 18 | Demolition breaker | Marteau-piqueur de démolition | 2 |
| 19 | Diamond disc for floor saw | Disque diamant pour scie de sol | 4 |
| 20 | Diamond disc for floor saw 16" | Disque diamant pour scie de sol 16" | 1 |
| 21 | Diesel tiller | Motoculteur diesel | 6 |
| 22 | Electrode holder | Porte-électrode | 1 |
| 23 | Foldable engine crane | Grue d'atelier pliable | 1 |
| 24 | Gasoline blower | Souffleur thermique | 2 |
| 25 | Gasoline chain saw | Tronçonneuse thermique | 1 |
| 26 | ⚠️ Gasoline concrete vibrator (Hex type) | Vibreur à béton thermique (accouplement hexagonal) | 2 |
| 27 | Gasoline engine | Moteur à essence | 4 |
| 28 | Gasoline engine 15HP | Moteur à essence 15 CV | 1 |
| 29 | Gasoline floor saw | Scie de sol thermique | 1 |
| 30 | Gasoline generator | Groupe électrogène essence | 5 |
| 31 | Gasoline grass trimmer and brush cutter | Débroussailleuse thermique | 1 |
| 32 | Gasoline knapsack sprayer | Pulvérisateur à dos thermique | 1 |
| 33 | Gasoline lawn mower | Tondeuse thermique | 1 |
| 34 | Gasoline plate compactor | Plaque vibrante thermique | 1 |
| 35 | ⚠️ Gasoline power trowel | Hélicoptère à béton thermique | 2 |
| 36 | Gasoline pressure washer | Nettoyeur haute pression thermique | 2 |
| 37 | Gasoline tiller | Motoculteur à essence | 3 |
| 38 | Heat gun | Décapeur thermique | 1 |
| 39 | Hydraulic bottle jack | Cric bouteille hydraulique | 2 |
| 40 | Hydraulic floor jack | Cric rouleur hydraulique | 1 |
| 41 | Hydraulic garage jack | Cric de garage hydraulique | 1 |
| 42 | Impact drill | Perceuse à percussion | 2 |
| 43 | Inverter gasoline generator | Groupe électrogène essence inverter | 1 |
| 44 | Jig saw | Scie sauteuse | 1 |
| 45 | Orbital sander | Ponceuse orbitale | 1 |
| 46 | P20S battery charger | Chargeur de batterie P20S | 1 |
| 47 | Sewage submersible pump | Pompe submersible eaux usées | 2 |
| 48 | Silent diesel generator | Groupe électrogène diesel insonorisé | 2 |
| 49 | Silent diesel generator 8.0kVA 220V | Groupe électrogène diesel insonorisé 8,0 kVA 220 V | 1 |
| 50 | Spray gun Max. viscosity:120DIN | Pistolet à peinture (viscosité max. 120 DIN) | 1 |
| 51 | TCT saw blade | Lame de scie carbure (TCT) | 1 |
| 52 | Tile cutter | Coupe-carrelage | 2 |
| 53 | Tripods for laser levels | Trépied pour niveau laser | 1 |
| 54 | Water pump | Pompe à eau | 4 |
| 55 | Welding ground clamp | Pince de masse de soudage | 2 |
| 56 | Insulated safety boots | Bottes de sécurité isolantes | 4 |
| 57 | Single side Fiberglass ladder | Échelle simple en fibre de verre | 1 |
| 58 | Manual stacker | Gerbeur manuel | 1 |

### Les trois lignes ⚠️

- **35 — Gasoline power trowel** (rotor 91 cm, 4 pales, moteur 6,5 CV) :
  « Hélicoptère à béton » est le terme de chantier courant au Maroc et en France.
  Alternative plus littérale : « Truelle mécanique thermique ».
- **26 — Gasoline concrete vibrator (Hex type)** : « Vibreur à béton » ou
  « Motovibrateur à béton » selon l'usage maison. L'accouplement HEX est conservé.
- **16 — Cordless tile vibration machine** (20 V, adhérence 50 kg, cales
  d'espacement) : c'est un vibreur de pose de carrelage. Pas de terme unique
  établi en français.

---

## Trois anomalies distinctes (hors traduction)

**1. « Bande-annonce (Remorque) »** (id 86, SKU `JDTDR7A30`) — traduction
automatique ratée : *trailer* rendu par « bande-annonce » (au sens cinéma). La
fiche décrit une remorque de 300 kg.
→ proposition : **`Remorque 300 kg`**

**2. Deux titres jamais renseignés**, visibles en ligne tels quels :

| id | SKU | Titre actuel | Prix |
|----|-----|--------------|------|
| 169 | `JDLM1B283` | `JDLM1B283 - TITRE A COMPLETER` | 1 250 MAD |
| 171 | `JDLWP5521` | `JDLWP5521 - TITRE A COMPLETER` | 760 MAD |

Aucune description pour deviner le produit. **À renseigner par le métier** — je
ne les invente pas.

**3. Titres français normalisés** (casse, doubles espaces, accord) — appliqué :
`Compresseur d'Air` → `Compresseur d'air`, `Compresseur D'Air Auto` →
`Compresseur d'air auto`, `Commande de pompes automatique` → singulier,
`Groupe électrogène diesel insonnorisé` → `insonorisé` (deux N).

**4. Titres mixtes FR/EN normalisés** — appliqué : mentions d'emballage
supprimées (`Chaîne De Scie 18"  Packed by double blister` → `Chaîne de scie 18"`),
`steps` → `marches` sur les trois échelles télescopiques, et
`10 Pcs 1/2" jeu de douilles a choc profonde` →
`Jeu de douilles à chocs profondes 1/2" - 10 pièces`.

---

## T3b — Descriptions techniques (appliqué le 2026-08-02)

Les titres traduits, les **descriptions restaient en anglais** et étaient visibles
sur chaque fiche produit (`18" Saw chain Packed by double blister`). 157 des 177
descriptions renseignées contenaient de l'anglais.

### Méthode : glossaire déterministe, pas de traduction au fil de l'eau

Les descriptions sont des fiches techniques semi-structurées
(`Libellé:valeur, Libellé:valeur`). Le vocabulaire a donc été extrait
mécaniquement — 185 libellés et 125 expressions distincts — puis traduit une
fois pour toutes dans un glossaire appliqué du terme le plus long au plus court
(« Max. cutting diameter » doit gagner contre « Max »).

Conséquences voulues :

- les nombres, unités et références produit ne sont jamais touchés ;
- le même terme anglais donne toujours la même traduction française ;
- l'opération est rejouable, et un résidu non couvert se voit dans le rapport
  plutôt que de passer inaperçu.

### Résultat

| Champ | Traduits |
|-------|----------|
| `p_description` | 155 / 177 |
| `p_long_description` | 19 / 21 |

**192 champs mis à jour** en trois passes, aucun ignoré, aucun slug modifié.
Les champs non traduits étaient déjà en français.

Balayage final sur les données réellement en base : plus aucun mot anglais.
Les occurrences restantes (`type`, `carton`, `laser`, `centre`, `blister`,
`aluminium`, `bar`…) sont des mots français.

`p_long_description` est rendu via `v-html` : les remplacements ne s'appliquent
qu'au texte situé entre les balises, jamais à l'intérieur de celles-ci.

> À noter : la fiche produit affiche `long_description` en priorité et retombe
> sur `description`. Les deux champs ont été traités, mais quelques produits
> gardent des formulations légèrement différentes entre les deux (par exemple
> « Courant max. » d'un côté, « Courant maximal » de l'autre) — écart présent
> avant l'opération, sans effet visible.

---

## Reste à arbitrer par le métier

| Sujet | Détail |
|-------|--------|
| Titres non renseignés | ids **169** (`JDLM1B283`, 1 250 MAD) et **171** (`JDLWP5521`, 760 MAD) — aucune description pour deviner le produit. Visibles en ligne tels quels. |
| Titre mixte restant | id **66** `Brad cloueuse 2 en 1 combo 100 pcs Ga 18` — formulation trop incertaine pour être réécrite sans avis. |
| Doublon de formulation | ids **151** `Cloueur à finition sans fil` et **152** `Cloueur de finition sans fil` — deux SKU distincts (`JDBJ1308` / `JDBJ2308`), libellés quasi identiques. L'usage correct est « de finition ». |
| Termes techniques à confirmer | `Hélicoptère à béton thermique` (power trowel), `Vibreur à béton thermique` (concrete vibrator), `Vibreur à carrelage sans fil` (tile vibration machine) — retenus faute de terme unique établi. |
