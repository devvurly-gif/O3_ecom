# O3 E-Commerce Frontend - Implementation Plan

## Stack
- **Vue 3** (Composition API + `<script setup>`)
- **Vite** (build tool)
- **Tailwind CSS v3** (styling)
- **Vue Router 4** (routing)
- **Pinia** (state management)
- **Axios** (HTTP client)

## API Source
O3_app E-Commerce Public API:
- Base URL: `http://o3_app.test/api/ecom`
- Auth: `X-Ecom-Api-Key` header
- Endpoints:
  - `GET /ecom/products` (filters: promo, new, category_id, brand_id, search, sort, per_page, page)
  - `GET /ecom/products/{slug}` (single product)
  - `GET /ecom/categories` (with product counts)
  - `GET /ecom/promotions` + `GET /ecom/promotions/{slug}`
  - `GET /ecom/slides` (banner carousel)

## Project Structure
```
O3_ecom/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env
├── src/
│   ├── main.js
│   ├── App.vue
│   ├── api/
│   │   └── axios.js          # Axios instance with API key
│   ├── router/
│   │   └── index.js           # Vue Router config
│   ├── stores/
│   │   ├── productStore.js    # Products state
│   │   ├── cartStore.js       # Cart state (localStorage)
│   │   └── categoryStore.js   # Categories state
│   ├── composables/
│   │   └── useCart.js         # Cart logic helper
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.vue
│   │   │   └── Footer.vue
│   │   ├── home/
│   │   │   ├── HeroSlider.vue
│   │   │   ├── PromoSection.vue
│   │   │   ├── FeaturedProducts.vue
│   │   │   └── CategoryGrid.vue
│   │   ├── product/
│   │   │   ├── ProductCard.vue
│   │   │   ├── ProductGrid.vue
│   │   │   └── ProductFilters.vue
│   │   ├── cart/
│   │   │   ├── CartDrawer.vue
│   │   │   └── CartItem.vue
│   │   └── ui/
│   │       ├── LoadingSpinner.vue
│   │       └── Pagination.vue
│   ├── pages/
│   │   ├── HomePage.vue
│   │   ├── ShopPage.vue
│   │   ├── ProductPage.vue
│   │   ├── CartPage.vue
│   │   ├── CheckoutPage.vue
│   │   └── PromotionPage.vue
│   └── assets/
│       └── css/
│           └── main.css       # Tailwind directives
```

## Pages & Features

### 1. HomePage
- Hero slider (from `/ecom/slides`)
- Category grid (from `/ecom/categories`)
- Featured/new products section
- Active promotions banner

### 2. ShopPage
- Product grid with filters (category, brand, search, sort)
- Pagination
- Sidebar with categories

### 3. ProductPage
- Product images gallery
- Title, price, description, long description
- Promotion badge if active
- Add to cart button with quantity selector

### 4. CartPage
- Cart items list (stored in localStorage via Pinia)
- Quantity update, remove item
- Order summary with totals

### 5. CheckoutPage
- Simple checkout form (name, email, phone, address)
- Order summary

### 6. PromotionPage
- List promotion products with promo prices

## Implementation Steps

1. **Project setup** - Vite + Vue 3 + Tailwind + dependencies
2. **API layer** - Axios instance, .env config
3. **Router + Layout** - Pages routing, Navbar, Footer
4. **Stores** - Pinia stores for products, categories, cart
5. **HomePage** - Slider, categories, featured products
6. **ShopPage** - Product grid, filters, pagination
7. **ProductPage** - Product detail with images
8. **Cart system** - CartDrawer, CartPage, localStorage persistence
9. **CheckoutPage** - Form + order summary
10. **Polish** - Responsive design, loading states, transitions
