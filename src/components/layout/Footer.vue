<template>
  <footer class="bg-gray-900 text-gray-400">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Brand -->
        <div>
          <div class="flex items-center gap-2 mb-4">
            <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white font-bold">O3</div>
            <span class="text-lg font-bold text-white">Store</span>
          </div>
          <p class="text-sm leading-relaxed">Votre boutique en ligne pour les meilleurs produits au Maroc.</p>
        </div>

        <!-- Links -->
        <div>
          <h3 class="text-sm font-semibold text-white mb-4">Navigation</h3>
          <ul class="space-y-2.5">
            <li><router-link to="/" class="text-sm hover:text-white transition">Accueil</router-link></li>
            <li><router-link to="/shop" class="text-sm hover:text-white transition">Boutique</router-link></li>
            <li><router-link to="/promotions" class="text-sm hover:text-white transition">Promotions</router-link></li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h3 class="text-sm font-semibold text-white mb-4">Contact</h3>
          <ul class="space-y-2.5 text-sm">
            <li>contact@o3store.ma</li>
            <li>+212 5XX-XXXXXX</li>
            <li>Casablanca, Maroc</li>
          </ul>
        </div>
      </div>

      <div class="mt-10 border-t border-gray-800 pt-6 text-center text-xs">
        &copy; {{ new Date().getFullYear() }} O3 Store. Tous droits r&eacute;serv&eacute;s.
      </div>
    </div>
  </footer>
</template>
