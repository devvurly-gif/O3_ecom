# T5 — Produits sans prix (tenant `jadema`)

**72 produits publiés sur 163** (44 % du catalogue visible)
n'ont pas de prix de vente saisi : `p_salePrice` vaut 0.

6 autres produits sans prix ne sont pas publiés en ligne, ils n'apparaissent
donc pas côté client.

## Garde-fou en place côté boutique

Un prix à zéro ne veut pas dire « gratuit », il veut dire « pas encore saisi ».
La boutique n'affiche plus `0,00 MAD` :

- la carte produit et la fiche affichent **« Prix sur demande »** ;
- la fiche propose un bouton **« Nous consulter »** vers le téléphone de la
  boutique (repli sur l'e-mail) ;
- le bouton d'ajout au panier est **désactivé** ;
- le panier **refuse** l'ajout même si l'appel vient d'ailleurs, et purge les
  articles sans prix enregistrés avant ce correctif.

La règle est unique (`isPurchasable` dans `useFormatPrice.js`) et partagée par
la carte, la fiche et le panier.

> Ceci évite d'afficher un prix faux. **Cela ne remplace pas la saisie des
> prix** : ces 72 produits ne sont pas vendables en ligne tant qu'ils
> n'ont pas de tarif.

## Répartition par catégorie

| Catégorie | Produits sans prix |
|-----------|--------------------|
| Non catégorisé | 28 |
| Source d'énergie | 27 |
| Motoculteurs | 9 |
| Pompes | 5 |
| Compresseurs à air | 3 |

## Liste complète à tarifer

### Non catégorisé — 28 produits

| id | SKU | Produit |
|----|-----|---------|
| 64 | `JDAT1512` | Clé à chocs pneumatique |
| 53 | `JDAP2R41` | Compresseur d'air |
| 54 | `JDAP2R81` | Compresseur d'air |
| 58 | `JDAP4R22` | Compresseur d'air |
| 59 | `JDAP4R33` | Compresseur d'air |
| 60 | `JDAP4R35` | Compresseur d'air |
| 70 | `JDGM2543` | Débroussailleuse thermique |
| 135 | `JDDC3502` | Disque diamant pour scie de sol |
| 23 | `JDDG2A80DT` | Groupe électrogène diesel insonorisé |
| 95 | `JDQM1A36` | Hélicoptère à béton thermique |
| 11 | `JDGNAA1706Q` | Moteur à essence |
| 46 | `JDGPS1A28` | Nettoyeur haute pression thermique |
| 172 | `JDMD151051` | Perceuse à percussion |
| 173 | `JDMD15851` | Perceuse à percussion |
| 30 | `JDEH9A03` | Pince de masse de soudage |
| 31 | `JDEH9A05` | Pince de masse de soudage |
| 32 | `JDWPVA01` | Pompe à eau |
| 34 | `JDWPCA03` | Pompe à eau |
| 36 | `JDWPJA04` | Pompe à eau |
| 37 | `JDWPJA05` | Pompe à eau |
| 42 | `JDWPQDC24` | Pompe submersible 24V DC (eau claire) |
| 40 | `JDWPWA03` | Pompe submersible eaux usées |
| 41 | `JDWPWA05` | Pompe submersible eaux usées |
| 149 | `JDBA1512001` | Ponceuse à bande |
| 150 | `JDBA15921` | Ponceuse à bande |
| 28 | `JDEH1A03` | Porte-électrode |
| 94 | `JDQF2A16` | Scie de sol thermique |
| 69 | `JDGC2558` | Tronçonneuse thermique |

### Source d'énergie — 27 produits

| id | SKU | Produit |
|----|-----|---------|
| 67 | `JDBN1550` | Cloueuse à air comprimé |
| 39 | `JDPC1A03` | Commande de pompe automatique |
| 93 | `JDPA2A160` | Compacteur À Plaque Réversible À Essence |
| 15 | `JDGEAA09` | Générateur d'essence |
| 3 | `JDGEAA13` | Groupe électrogène essence |
| 14 | `JDGEAA056D` | Groupe électrogène essence |
| 16 | `JDGEAA106` | Groupe électrogène essence |
| 17 | `JDGEAA116` | Groupe électrogène essence |
| 18 | `JDGEAB06` | Groupe électrogène essence inverter |
| 1 | `JDGNAA170Q` | Moteur à essence |
| 2 | `JDGNAA190Q` | Moteur à essence |
| 111 | `PRD-00012` | Moteur à essence 15 CV |
| 99 | `JDECV2A15` | Moteur vibrateur électrique (type HEX) |
| 9 | `JDHP1A12` | Nettoyeur haute pression |
| 45 | `JDHP3A22` | Nettoyeur haute pression |
| 48 | `JDDPS1A36` | Nettoyeur haute pression diesel |
| 10 | `JDAY1A10` | Pistolet pulvérisateur sans air |
| 91 | `JDPM3A090` | Plaque vibrante thermique |
| 29 | `JDEH1A06` | Porte-électrode |
| 26 | `JDWD11601` | Poste À Souder Onduleur MMA |
| 27 | `JDWD32001` | Poste À Souder Onduleur MMA |
| 68 | `JDGC1552` | Scie à chaîne à essence |
| 72 | `JDYQ1A25` | Souffleur thermique |
| 73 | `JDYQ3A25` | Souffleur thermique |
| 71 | `JDGM3A18` | Tondeuse thermique |
| 97 | `JDGB2A22` | Vibreur à béton thermique (accouplement hexagonal) |
| 98 | `JDGB2A12` | Vibreur à béton thermique (accouplement hexagonal) |

### Motoculteurs — 9 produits

| id | SKU | Produit |
|----|-----|---------|
| 76 | `JDTL2A75` | Motoculteur à essence |
| 77 | `JDTL2A1001` | Motoculteur à essence |
| 78 | `JDTL2A100` | Motoculteur à essence |
| 79 | `JDTL3A1001` | Motoculteur diesel |
| 80 | `JDTL3A100` | Motoculteur diesel |
| 81 | `JDTL3A1351` | Motoculteur diesel |
| 82 | `JDTL3A135` | Motoculteur diesel |
| 83 | `JDTL3A1351D` | Motoculteur diesel |
| 84 | `JDTL3A135D` | Motoculteur diesel |

### Pompes — 5 produits

| id | SKU | Produit |
|----|-----|---------|
| 38 | `JDPC1A01` | Commande de pompe automatique |
| 24 | `JDDW1A30` | Pompe à eau diesel |
| 25 | `JDDW1A40` | Pompe à eau diesel |
| 33 | `JDWPVA03` | Pompe périphérique |
| 35 | `JDWPJA03` | Pompe périphérique |

### Compresseurs à air — 3 produits

| id | SKU | Produit |
|----|-----|---------|
| 55 | `JDAP3A50` | Compresseur d'air |
| 56 | `JDAP4A15` | Compresseur d'air |
| 57 | `JDAP4R11` | Compresseur d'air |
