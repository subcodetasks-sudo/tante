import watermark from "watermarkjs"
import { DEFAULT_LOGO } from "@/components/SiteLogo"

const MARK_ALPHA = 0.55
const MARK_SIZE_RATIO = 0.28
const MARK_PADDING = 14
const MARK_RADIUS_RATIO = 0.22

const cache = new Map<string, Promise<string>>()

/**
 * Rewrite API-hosted media to a same-origin path so canvas watermarking
 * is not blocked by missing CORS headers (dev uses the Vite /storage proxy).
 */
export function toCanvasSafeUrl(src: string): string {
  if (
    !src ||
    src.startsWith("/") ||
    src.startsWith("blob:") ||
    src.startsWith("data:")
  ) {
    return src
  }

  const base = (import.meta.env.PUBLIC_BASE_URL ?? "").replace(/\/$/, "")
  if (!base) return src

  try {
    const url = new URL(src)
    const apiOrigin = new URL(base).origin
    if (url.origin !== apiOrigin) return src

    const pathWithQuery = `${url.pathname}${url.search}`
    if (typeof window === "undefined") return pathWithQuery

    // Same origin as the API: keep the absolute URL.
    if (window.location.origin === apiOrigin) return src

    // Cross-origin app (e.g. localhost): use proxied relative path.
    return pathWithQuery
  } catch {
    return src
  }
}

function loadImageElement(src: string): Promise<HTMLImageElement> {
  const safeSrc = toCanvasSafeUrl(src)

  return fetch(safeSrc)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch image (${response.status}): ${safeSrc}`)
      }
      return response.blob()
    })
    .then(
      (blob) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          const objectUrl = URL.createObjectURL(blob)
          const image = new Image()
          image.onload = () => {
            URL.revokeObjectURL(objectUrl)
            resolve(image)
          }
          image.onerror = () => {
            URL.revokeObjectURL(objectUrl)
            reject(new Error(`Failed to decode image: ${safeSrc}`))
          }
          image.src = objectUrl
        }),
    )
}

function drawRoundedLogoWatermark(
  target: HTMLCanvasElement,
  mark: HTMLCanvasElement,
): HTMLCanvasElement {
  const maxSide = Math.min(target.width, target.height) * MARK_SIZE_RATIO
  const scale = Math.min(1, maxSide / Math.max(mark.width, mark.height, 1))
  const width = Math.max(1, mark.width * scale)
  const height = Math.max(1, mark.height * scale)
  const x = target.width - width - MARK_PADDING
  const y = target.height - height - MARK_PADDING
  const radius = Math.min(width, height) * MARK_RADIUS_RATIO

  const context = target.getContext("2d")
  if (!context) return target

  context.save()
  context.globalAlpha = MARK_ALPHA
  context.beginPath()
  context.roundRect(x, y, width, height, radius)
  context.clip()
  context.drawImage(mark, x, y, width, height)
  context.restore()

  return target
}

async function resolveLogoImage(logoSrc?: string | null): Promise<HTMLImageElement> {
  const candidates = [
    logoSrc?.trim() || "",
    DEFAULT_LOGO,
  ].filter((value, index, list) => value && list.indexOf(value) === index)

  let lastError: unknown
  for (const candidate of candidates) {
    try {
      return await loadImageElement(candidate)
    } catch (error) {
      lastError = error
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Unable to load watermark logo")
}

async function createWatermarkedDataUrl(
  imageSrc: string,
  logoSrc?: string | null,
): Promise<string> {
  const [photo, logo] = await Promise.all([
    loadImageElement(imageSrc),
    resolveLogoImage(logoSrc),
  ])

  const result = (await watermark([photo, logo]).image(
    drawRoundedLogoWatermark,
  )) as HTMLImageElement

  return result.src
}

/**
 * Embeds the app logo into an image via watermarkjs (lower-right, faded, rounded).
 * Falls back to DEFAULT_LOGO when the settings logo is missing or fails to load.
 */
export function applyLogoWatermark(
  imageSrc: string,
  logoSrc?: string | null,
): Promise<string> {
  const resolvedLogo = logoSrc?.trim() || DEFAULT_LOGO
  const key = `${imageSrc}::${resolvedLogo}`

  const cached = cache.get(key)
  if (cached) return cached

  const pending = createWatermarkedDataUrl(imageSrc, resolvedLogo).catch(
    (error) => {
      cache.delete(key)
      throw error
    },
  )
  cache.set(key, pending)
  return pending
}
