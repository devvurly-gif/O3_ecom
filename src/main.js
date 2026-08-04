import { createApp, reactive } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './assets/main.css'
import api from './api/axios'

const app = createApp(App)
app.use(createPinia())
app.use(router)

/**
 * Configuration boutique (nom, logo, coordonnées), servie par le tenant.
 *
 * Objet réactif fourni AVANT le montage puis rempli à l'arrivée de la réponse.
 * L'application ne se montait auparavant qu'une fois /config résolu : sur le
 * réseau réel cela retardait le premier rendu d'environ 1,5 s, et la page ne
 * commençait à charger ses propres données qu'ensuite — d'où l'écran figé.
 *
 * Les consommateurs (Navbar, Footer, useShopContact) lisent déjà `config.shop`
 * au travers d'un computed : ils se mettent à jour d'eux-mêmes.
 *
 * La clé d'API n'est pas renvoyée ici (audit sécurité C3) : elle est injectée
 * au build via VITE_API_KEY, voir api/axios.js.
 */
const shopConfig = reactive({})
app.provide('shopConfig', shopConfig)

app.mount('#app')

api.get('/config')
  .then(({ data }) => Object.assign(shopConfig, data))
  .catch(() => {
    // Une boutique dont la configuration ne répond pas reste navigable :
    // les composants retombent sur leurs valeurs par défaut.
  })
