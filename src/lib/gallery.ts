import {
  getYoutubeVideoId,
  youtubeEmbedUrl,
  youtubeThumbnailUrl,
} from "@/lib/youtube"
import type { GalleryItem } from "@/types/api"

export type GalleryMediaItem = {
  src: string
  alt: string
  type: "image" | "video"
  /** YouTube embed URL or direct video file URL */
  videoUrl?: string
  /** `youtube` → iframe embed, `file` → HTML video */
  videoKind?: "youtube" | "file"
}

export function toGalleryMediaItem(
  item: GalleryItem,
): GalleryMediaItem | null {
  if (item.type === "video" && item.video_url) {
    const youtubeId = getYoutubeVideoId(item.video_url)
    if (youtubeId) {
      return {
        src: item.image || youtubeThumbnailUrl(youtubeId),
        alt: item.title,
        type: "video",
        videoUrl: youtubeEmbedUrl(youtubeId),
        videoKind: "youtube",
      }
    }

    return {
      src: item.image || "/about-us.jpg",
      alt: item.title,
      type: "video",
      videoUrl: item.video_url,
      videoKind: "file",
    }
  }

  if (item.type === "image" && item.image) {
    return {
      src: item.image,
      alt: item.title,
      type: "image",
    }
  }

  return null
}
