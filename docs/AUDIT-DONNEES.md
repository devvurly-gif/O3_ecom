# Audit des données du catalogue — tenant `jadema`

Le storefront n'affiche que ce que l'API `/api/ecom` lui renvoie. Une partie
des défauts relevés lors de l'audit de `shop.jadema.o3app.ma` ne se corrige
donc **pas dans le code** : ce sont des données saisies dans l'ERP.

Ce document trace ce qui a été corrigé en base et ce qui reste à faire côté
métier. Les textes d'interface, eux, vivent dans `src/config/content.js`.

---

## T2 — Textes marketing (corrigé le 2026-08-01)

### Slides (module Marketing → Slides)

| # | Champ | Avant | Après |
|---|-------|-------|-------|
| 1 | `button_text` | `Prennez en main` | `Prenez en main` |
| 2 | `title` | `Outils Mesures` | `Outils de mesure` |
| 2 | `subtitle` | `Mesures  de precision` | `Mesures de précision` |
| 2 | `button_text` | `Allez` | `Découvrir` |
| 3 | `title` | `vos bricolages de weekend sont amusant avec jadever` | `Vos bricolages du week-end sont plus amusants avec Jadever` |
| 3 | `button_text` | `Amusez vous` | `Voir les produits` |

Le slide 3 cumulait quatre défauts : minuscule initiale, accord (`amusant` →
`amusants`), `weekend` → `week-end`, et la marque en minuscules.

### Catégories (module Catalogue → Catégories)

| id | Avant | Après | Motif |
|----|-------|-------|-------|
| 3 | `Aspirateurs Professionnelles` | `Aspirateurs professionnels` | accord en genre + capitale injustifiée |
| 4 | `Compresseurs Air` | `Compresseurs à air` | préposition manquante |
| 6 | `Motocultures` | `Motoculteurs` | la catégorie contient des *tillers* (motoculteurs), pas des cultures |
| 8 | `Diamand Disque` | `Disques diamant` | faute (`Diamand`) + ordre des mots |

`Échelles`, `Pompes` et `Source d'énergie` étaient corrects.

Les corrections ont été appliquées par un script apparié à la valeur attendue :
une donnée modifiée entre-temps est signalée, jamais écrasée.

---

## Anomalies de rattachement repérées (à traiter en T4)

- **Catégorie 8 « Disques diamant »** ne contient qu'un seul produit, une
  *Clé à chocs sans fil 20V* — ce n'est pas un disque diamant.
- **Catégorie 7 « Échelles »** contient un *Silent diesel generator 8.0kVA*.
- **Catégorie 1 « Non catégorisé »** sert de fourre-tout par défaut (créée
  automatiquement à la création du tenant, cf. `TenantController`).

## Noms de produits en anglais (à traiter en T3)

Relevé partiel : `Gasoline engine`, `Silent diesel generator`, `Electrode holder`,
`Welding ground clamp`, `Water pump`, `Sewage submersible pump`, `Gasoline tiller`,
`Diesel tiller`, `Gasoline generator`, `Battery load tester`, `Auto air compressor`.
Inventaire complet et stratégie de traduction : voir T3.
