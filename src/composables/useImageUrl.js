import { STORAGE_BASE_URL } from '@/api/axios'

export function useImageUrl() {
  function imageUrl(input) {
    if (!input) return '/placeholder.svg'

    // If input is an object (e.g. {url: '...', isPrimary: true}), extract the url
    const path = typeof input === 'object' ? (input.url || input.image || '') : input
    if (!path) return '/placeholder.svg'

    // External URLs — leave as-is
    if (path.startsWith('http')) return path

    // Remove leading /storage/ if already present to avoid duplication
    const cleanPath = path.replace(/^\/?storage\//, '')
    return `${STORAGE_BASE_URL}/storage/${cleanPath}`
  }

  return { imageUrl }
}
