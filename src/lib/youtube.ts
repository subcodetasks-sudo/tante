export function getYoutubeVideoId(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.replace(/^\//, "").split("/")[0] || null
    }
    const fromQuery = parsed.searchParams.get("v")
    if (fromQuery) return fromQuery
    const match = parsed.pathname.match(/\/(?:embed|shorts)\/([^/?#]+)/)
    return match?.[1] ?? null
  } catch {
    return null
  }
}

export function youtubeThumbnailUrl(videoId: string) {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
}

export function youtubeEmbedUrl(videoId: string) {
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
}
