import { ref } from 'vue'

// Shared across the whole app (module singleton, not per-component state):
// flips true once the initial page's data fetch has settled, so main.js
// knows it's safe to hide the full-screen boot loader.
export const appDataReady = ref(false)

export function markAppReady() {
  appDataReady.value = true
}
