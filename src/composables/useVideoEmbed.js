// Converts external video links (YouTube, Vimeo, ...) into an embeddable
// iframe URL. Returns null for unrecognized providers so callers can fall
// back to a plain "open in new tab" link instead of an iframe.
export function useVideoEmbed() {
  function embedUrl(url) {
    if (!url) return null

    let u
    try {
      u = new URL(url)
    } catch {
      return null
    }

    const host = u.hostname.replace(/^www\.|^m\./, '')

    if (host === 'youtu.be') {
      const id = u.pathname.slice(1)
      return id ? `https://www.youtube.com/embed/${id}` : null
    }

    if (host === 'youtube.com') {
      if (u.pathname === '/watch') {
        const id = u.searchParams.get('v')
        return id ? `https://www.youtube.com/embed/${id}` : null
      }
      if (u.pathname.startsWith('/embed/')) return url
      if (u.pathname.startsWith('/shorts/')) {
        const id = u.pathname.split('/')[2]
        return id ? `https://www.youtube.com/embed/${id}` : null
      }
    }

    if (host === 'vimeo.com') {
      const id = u.pathname.split('/').filter(Boolean)[0]
      return id && /^\d+$/.test(id) ? `https://player.vimeo.com/video/${id}` : null
    }

    if (host === 'player.vimeo.com') return url

    return null
  }

  // Best-effort thumbnail preview — only YouTube exposes a stable,
  // no-auth thumbnail URL pattern. Other providers show a generic
  // play icon instead (see thumbnailUrl returning null).
  function thumbnailUrl(url) {
    if (!url) return null

    let u
    try {
      u = new URL(url)
    } catch {
      return null
    }

    const host = u.hostname.replace(/^www\.|^m\./, '')
    let id = null

    if (host === 'youtu.be') {
      id = u.pathname.slice(1)
    } else if (host === 'youtube.com') {
      if (u.pathname === '/watch') id = u.searchParams.get('v')
      else if (u.pathname.startsWith('/shorts/')) id = u.pathname.split('/')[2]
    }

    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null
  }

  return { embedUrl, thumbnailUrl }
}
