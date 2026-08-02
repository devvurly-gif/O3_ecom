# T4 — Produits « Non catégorisé » (tenant `jadema`)

**97 produits**, dont **81 publiés en ligne**, sont rattachés à la catégorie
fourre-tout « Non catégorisé » — soit la moitié du catalogue visible.

## Diagnostic : défaut de données, pas d'affichage

Le front affichait fidèlement ce que l'API lui envoyait. « Non catégorisé » est
une **vraie catégorie** (id 1), créée automatiquement à la naissance de chaque
tenant par `TenantController::seedDefaults()` pour accueillir les produits
importés sans rattachement. Même mécanique pour la marque « Marque inconnue ».

Ces béquilles internes de l'ERP ressortaient telles quelles sur la boutique :
badge `NON CATÉGORISÉ` en capitales au-dessus du nom du produit, et entrée
« Non catégorisé (81) » dans le filtre latéral.

## Corrigé côté API

L'API traite désormais ces libellés comme une absence de rattachement : plus de
badge, plus d'entrée dans les listes de filtres. Les produits restent visibles
et vendables. Le pilotage est dans `config/ecom.php` (dépôt O3_app), pas éparpillé
dans le code.

Le correctif porte sur l'API plutôt que sur le front : le storefront affiche déjà
le badge sous `v-if="product.category"`, il suffit donc que l'API renvoie `null`
pour que la fiche produit et la carte suivent toutes les deux. Un seul endroit à
maintenir, et tous les tenants en bénéficient.

Le repli est volontairement sans danger : un tenant qui renomme la catégorie en
fait une vraie catégorie, qui réapparaît normalement dans les filtres.

> **Ce correctif masque le symptôme, il ne rattache pas les produits.**
> Le rattachement ci-dessous reste à faire dans l'ERP.

---

## Rapport de rattachement proposé

### A. Rattachements vers des catégories existantes — 24 produits

**Aspirateurs professionnels** — 1 produits

| id | Produit | Prix |
|----|---------|------|
| 170 | Aspirateur sans fil 20V | 450 |

**Compresseurs à air** — 5 produits

| id | Produit | Prix |
|----|---------|------|
| 53 | Compresseur d'air | **0** |
| 54 | Compresseur d'air | **0** |
| 58 | Compresseur d'air | **0** |
| 59 | Compresseur d'air | **0** |
| 60 | Compresseur d'air | **0** |

**Disques diamant** — 5 produits

| id | Produit | Prix |
|----|---------|------|
| 113 | Disque diamant pour scie de sol | 800 |
| 119 | Disque diamant pour scie de sol | 850 |
| 118 | Disque diamant pour scie de sol | 750 |
| 135 | Disque diamant pour scie de sol | **0** |
| 114 | Disque diamant pour scie de sol 16" | 850 |

**Pompes** — 7 produits

| id | Produit | Prix |
|----|---------|------|
| 32 | Pompe à eau | **0** |
| 34 | Pompe à eau | **0** |
| 36 | Pompe à eau | **0** |
| 37 | Pompe à eau | **0** |
| 42 | Pompe submersible 24V DC (eau claire) | **0** |
| 41 | Pompe submersible eaux usées | **0** |
| 40 | Pompe submersible eaux usées | **0** |

**Source d'énergie** — 5 produits

| id | Produit | Prix |
|----|---------|------|
| 165 | Batterie lithium-ion 20V 2,0 Ah | 249 |
| 123 | Chargeur de batterie P20S | 180 |
| 23 | Groupe électrogène diesel insonorisé | **0** |
| 11 | Moteur à essence | **0** |
| 166 | Pack de batteries lithium-ion | 450 |

**Échelles** — 1 produits

| id | Produit | Prix |
|----|---------|------|
| 167 | Échelle simple en fibre de verre | 1200 |

### B. Regroupements nécessitant une nouvelle catégorie — 71 produits

**Consommables et accessoires** — 14 produits

| id | Produit | Prix |
|----|---------|------|
| 185 | Chaîne de scie 18" | 350 |
| 141 | Disque à ébarber métal | 25 |
| 143 | Disque à ébarber métal | 25 |
| 136 | Disque à tronçonner métal | 30 |
| 139 | Disque à tronçonner métal | 45 |
| 140 | Disque à tronçonner métal | 10 |
| 146 | Disque à tronçonner métal | 30 |
| 142 | Disque à tronçonner métal | 35 |
| 137 | Disque à tronçonner métal | 8 |
| 144 | Disque à tronçonner métal | 25 |
| 145 | Disque à tronçonner métal | 30 |
| 183 | Lame de scie carbure (TCT) | 120 |
| 115 | Lame pour débroussailleuse | 100 |
| 120 | Lame pour débroussailleuse | 100 |

**Jardin et espaces verts** — 3 produits

| id | Produit | Prix |
|----|---------|------|
| 74 | Atomiseur thermique | 1390 |
| 70 | Débroussailleuse thermique | **0** |
| 69 | Tronçonneuse thermique | **0** |

**Levage et manutention** — 6 produits

| id | Produit | Prix |
|----|---------|------|
| 133 | Cric bouteille hydraulique | 860 |
| 132 | Cric bouteille hydraulique | 320 |
| 160 | Cric de garage hydraulique | 1400 |
| 161 | Cric rouleur hydraulique | 1400 |
| 177 | Gerbeur manuel | 12000 |
| 184 | Grue d'atelier pliable | 2480 |

**Matériel de chantier** — 8 produits

| id | Produit | Prix |
|----|---------|------|
| 126 | Coupe-carrelage | 1100 |
| 127 | Coupe-carrelage | 1450 |
| 95 | Hélicoptère à béton thermique | **0** |
| 117 | Machine vibrante pour carrelage sans fil | 950 |
| 156 | Marteau-piqueur de démolition | 2400 |
| 155 | Marteau-piqueur de démolition | 1500 |
| 94 | Scie de sol thermique | **0** |
| 122 | Vibreur à carrelage sans fil | 700 |

**Mesure et niveau** — 2 produits

| id | Produit | Prix |
|----|---------|------|
| 124 | Niveau laser 3D sans fil | 1800 |
| 125 | Trépied pour niveau laser | **0** |

**Nettoyage haute pression** — 1 produits

| id | Produit | Prix |
|----|---------|------|
| 46 | Nettoyeur haute pression thermique | **0** |

**Outillage électroportatif** — 30 produits

| id | Produit | Prix |
|----|---------|------|
| 64 | Clé à chocs pneumatique | **0** |
| 154 | Clé à chocs sans fil | 720 |
| 121 | Clé à chocs sans fil | 1390 |
| 151 | Cloueur à finition sans fil | 1390 |
| 152 | Cloueur de finition sans fil | 1500 |
| 159 | Décapeur thermique | 250 |
| 180 | Marteau perforateur | 750 |
| 181 | Marteau perforateur 1500W | 920 |
| 178 | Marteau perforateur 800W | 649 |
| 179 | Marteau perforateur 800W | 749 |
| 168 | Marteau perforateur sans fil | 1190 |
| 148 | Meuleuse d'angle 2000W | 749 |
| 164 | Meuleuse sans fil brushless 20V | 990 |
| 175 | Mixeur 1200W | 899 |
| 174 | Outil multifonction sans fil | 540 |
| 173 | Perceuse à percussion | **0** |
| 172 | Perceuse à percussion | **0** |
| 157 | Perceuse électrique | 350 |
| 158 | Pistolet à peinture (viscosité max. 120 DIN) | 350 |
| 182 | Pistolet à peinture sans fil | 550 |
| 147 | Polisseuse 1200W | 699 |
| 149 | Ponceuse à bande | **0** |
| 150 | Ponceuse à bande | **0** |
| 134 | Ponceuse orbitale | 1400 |
| 176 | Scie circulaire sans fil | 720 |
| 163 | Scie sauteuse | 380 |
| 162 | Scie sauteuse 400W | 320 |
| 138 | Souffleur aspirateur électrique | 260 |
| 153 | Souffleur sans fil | 750 |
| 104 | Tournevis sans fil 4V | **0** |

**Soudure** — 3 produits

| id | Produit | Prix |
|----|---------|------|
| 31 | Pince de masse de soudage | **0** |
| 30 | Pince de masse de soudage | **0** |
| 28 | Porte-électrode | **0** |

**Équipements de protection** — 4 produits

| id | Produit | Prix |
|----|---------|------|
| 128 | Bottes de sécurité isolantes | 250 |
| 129 | Bottes de sécurité isolantes | **0** |
| 130 | Bottes de sécurité isolantes | 250 |
| 131 | Bottes de sécurité isolantes | 250 |

### C. Indéterminés — 2 produits

**—** — 2 produits

| id | Produit | Prix |
|----|---------|------|
| 169 | JDLM1B283 - TITRE A COMPLETER | 1250 |
| 171 | JDLWP5521 - TITRE A COMPLETER | 760 |

---

## Ce que chaque groupe demande

| Groupe | Produits | Décision nécessaire |
|--------|----------|---------------------|
| **A** — catégories existantes | 24 | aucune : les catégories sont déjà là, rattachement applicable immédiatement |
| **B** — nouvelles catégories | 71 | créer 9 catégories — choix de marchandisage, pas une correction technique |
| **C** — indéterminés | 2 | les deux fiches sans titre (voir T3) |

Les 9 catégories du groupe B : Outillage électroportatif, Consommables et
accessoires, Levage et manutention, Matériel de chantier, Jardin et espaces
verts, Nettoyage haute pression, Mesure et niveau, Soudure, Équipements de
protection.

Le classement a été établi à partir des noms de produits traduits en T3. Un nom
seul ne suffit pas toujours : à revoir avant application, notamment pour les
frontières entre « Outillage électroportatif » et « Matériel de chantier ».

## Anomalies de rattachement dans les catégories existantes

Relevées en T2, indépendantes du fourre-tout :

- **Disques diamant** ne contient qu'une *Clé à chocs sans fil* — après
  rattachement du groupe A, elle accueillera les 5 disques diamant qui lui
  reviennent, mais la clé à chocs reste à déplacer.
- **Échelles** contient un *Groupe électrogène diesel 8,0 kVA*.
