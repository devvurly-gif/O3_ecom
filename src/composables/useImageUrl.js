import { STORAGE_BASE_URL } from '@/api/axios'

export function useImageUrl() {
  function imageUrl(input) {
    if (!input) return '/placeholder.svg'

    // If input is an object (e.g. {url: '...', isPrimary: true}), extract the url
    const path = typeof input === 'object' ? (input.url || input.image || '') : String(input)
    if (!path) return '/placeholder.svg'

    // External URLs — leave as-is
    if (path.startsWith('http')) return path

    // Strip ALL leading /storage/ occurrences (handles double/triple duplication)
    let cleanPath = path
    while (/^\/?storage\//.test(cleanPath)) {
      cleanPath = cleanPath.replace(/^\/?storage\//, '')
    }

    if (!cleanPath) return '/placeholder.svg'

    return `${STORAGE_BASE_URL}/storage/${cleanPath}`
  }

  return { imageUrl }
}
