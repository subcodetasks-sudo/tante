export const DEFAULT_LOGO = "/logo.png"

type SiteLogoProps = {
  src?: string | null
  alt: string
  className?: string
}

export function SiteLogo({ src, alt, className }: SiteLogoProps) {
  return (
    <img
      src={src || DEFAULT_LOGO}
      alt={alt}
      className={className}
      onError={(event) => {
        const img = event.currentTarget
        if (img.dataset.fallback === "1") return
        img.dataset.fallback = "1"
        img.src = DEFAULT_LOGO
      }}
    />
  )
}
