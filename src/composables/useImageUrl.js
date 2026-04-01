import { STORAGE_BASE_URL } from '@/api/axios'

export function useImageUrl() {
  function imageUrl(path) {
    if (!path) return '/placeholder.svg'
    if (path.startsWith('http')) return path
    return `${STORAGE_BASE_URL}/storage/${path}`
  }

  return { imageUrl }
}
