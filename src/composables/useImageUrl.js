import { STORAGE_BASE_URL } from '@/api/axios'

export function useImageUrl() {
  function imageUrl(path) {
    if (!path) return '/placeholder.svg'
    if (path.startsWith('http')) return path
    // Remove leading /storage/ if already present to avoid duplication
    const cleanPath = path.replace(/^\/?storage\//, '')
    return `${STORAGE_BASE_URL}/storage/${cleanPath}`
  }

  return { imageUrl }
}
