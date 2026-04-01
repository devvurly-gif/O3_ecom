import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const STORAGE_KEY = 'o3_theme'

export const useThemeStore = defineStore('theme', () => {
  const dark = ref(loadTheme())

  function loadTheme() {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  function toggle() {
    dark.value = !dark.value
  }

  watch(dark, (val) => {
    localStorage.setItem(STORAGE_KEY, val ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', val)
  }, { immediate: true })

  return { dark, toggle }
})
