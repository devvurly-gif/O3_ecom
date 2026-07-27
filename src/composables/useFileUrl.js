import { STORAGE_BASE_URL } from '@/api/axios'

export function useFileUrl() {
  function fileUrl(path) {
    if (!path) return null

    // External URLs — leave as-is
    if (path.startsWith('http')) return path

    // Strip ALL leading /storage/ occurrences (handles double/triple duplication)
    let cleanPath = path
    while (/^\/?storage\//.test(cleanPath)) {
      cleanPath = cleanPath.replace(/^\/?storage\//, '')
    }

    if (!cleanPath) return null

    return `${STORAGE_BASE_URL}/storage/${cleanPath}`
  }

  function fileSize(bytes) {
    if (!bytes) return ''
    const kb = bytes / 1024
    if (kb < 1024) return `${Math.round(kb)} Ko`
    return `${(kb / 1024).toFixed(1)} Mo`
  }

  return { fileUrl, fileSize }
}
