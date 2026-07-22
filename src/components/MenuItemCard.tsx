import { useEffect, useState } from "react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { applyLogoWatermark } from "@/lib/applyLogoWatermark"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { DEFAULT_LOGO, SiteLogo } from "@/components/SiteLogo"
import { useFavoritesStore } from "@/store/favoritesStore"
import { useSiteStore } from "@/store/siteStore"
import type { Product, ProductWeight } from "@/types/api"
import { Flame, Heart, Scale } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

type MenuItemCardProps = {
  item: Product
  categoryName?: string
  categoryId?: number
  className?: string
  onAdd?: () => void
}

export function MenuItemCard({
  item,
  categoryName,
  categoryId,
  className,
  onAdd,
}: MenuItemCardProps) {
  const isFavorite = useFavoritesStore((s) => s.isFavorite(item.id))
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite)
  const settings = useSiteStore((s) => s.settings)
  const logoSrc = settings?.logo?.trim() || DEFAULT_LOGO
  const [watermarkedImage, setWatermarkedImage] = useState<{
    source: string
    result: string
    embedded: boolean
  } | null>(null)

  useEffect(() => {
    if (!item.image) return

    let cancelled = false

    applyLogoWatermark(item.image, logoSrc)
      .then((src) => {
        if (!cancelled) {
          setWatermarkedImage({
            source: item.image!,
            result: src,
            embedded: true,
          })
        }
      })
      .catch(() => {
        if (!cancelled) {
          setWatermarkedImage({
            source: item.image!,
            result: item.image!,
            embedded: false,
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [item.image, logoSrc])

  const displayImage =
    item.image && watermarkedImage?.source === item.image
      ? watermarkedImage.result
      : item.image

  const showOverlayLogo =
    Boolean(item.image) &&
    watermarkedImage?.source === item.image &&
    !watermarkedImage.embedded

  const favoriteLabel = isFavorite
    ? "إزالة من المفضلة"
    : "إضافة إلى المفضلة"

  const handleFavorite = () => {
    const nextFavorite = !isFavorite
    const resolvedCategoryId = categoryId ?? item.category_id ?? item.category?.id
    const category =
      resolvedCategoryId != null
        ? {
            id: resolvedCategoryId,
            name_ar:
              categoryName?.trim() ||
              item.category?.name_ar ||
              item.category?.name_en ||
              "",
            name_en: item.category?.name_en || categoryName?.trim() || "",
          }
        : item.category

    toggleFavorite(item, category)
    toast.success(
      nextFavorite
        ? "تمت إضافة المنتج إلى المفضلة"
        : "تمت إزالة المنتج من المفضلة",
    )
  }

  const resolvedCategory =
    categoryName?.trim() ||
    item.category?.name_ar?.trim() ||
    item.category?.name_en?.trim() ||
    ""

  const weightOptions = (item.weights ?? []).filter(
    (option): option is ProductWeight =>
      Boolean(option?.weight?.trim()) && option.price != null,
  )
  const hasWeightOptions = weightOptions.length > 0

  return (
    <article
      id={`menu-item-${item.id}`}
      className={cn(
        "glass-panel group flex flex-col overflow-hidden rounded-2xl border border-tant-gold/25 shadow-md shadow-black/20 transition-shadow hover:shadow-lg hover:shadow-black/30",
        className,
      )}
    >
      <div className="p-1">
        <div className="relative flex aspect-4/3 w-full items-center justify-center overflow-hidden rounded-t-2xl bg-linear-to-b from-tant-green/35 to-tant-green-deep/65">
          {displayImage ? (
            <img
              src={displayImage}
              alt={item.name_ar}
              className="size-full object-cover"
              draggable={false}
            />
          ) : (
            <span className="px-4 text-center font-display text-sm tracking-wider text-tant-gold/80">
              {item.name_ar}
            </span>
          )}
          <div className="absolute inset-e-2 top-2 z-10">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  delay={300}
                  render={(props) => (
                    <button
                      {...props}
                      type="button"
                      onClick={(event) => {
                        props.onClick?.(event)
                        handleFavorite()
                      }}
                      aria-label={favoriteLabel}
                      aria-pressed={isFavorite}
                      className={cn(
                        props.className,
                        "inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-tant-cream transition-colors hover:bg-black/35",
                      )}
                    >
                      <Heart
                        className={cn(
                          "h-4 w-4 transition-colors",
                          isFavorite && "fill-red-500 text-red-500",
                        )}
                      />
                    </button>
                  )}
                />
                <TooltipContent side="bottom">{favoriteLabel}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {showOverlayLogo ? (
            <SiteLogo
              src={logoSrc}
              alt=""
              className="pointer-events-none absolute inset-s-2 bottom-2 z-10 size-10 rounded-lg object-cover opacity-50"
            />
          ) : null}
        </div>

        {resolvedCategory ? (
          <div>
            <div className="rounded-b-full bg-tant-gold px-3 py-1 text-center text-[0.65rem] font-medium tracking-wide text-tant-green-deep">
              {resolvedCategory}
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 justify-end flex-col gap-2 px-4 py-3">
        <h3 className="min-w-0 truncate font-display text-base text-tant-cream">
          {item.name_ar}
        </h3>

        {hasWeightOptions ? (
          <div className="mt-auto space-y-2">
            <div className="flex items-center gap-1.5 text-[0.65rem] font-medium tracking-wide text-tant-muted">
              <Scale className="size-3 shrink-0 text-tant-gold/75" aria-hidden />
              <span>الأحجام المتاحة</span>
            </div>
            <div
              className={cn(
                "grid gap-1.5",
                weightOptions.length > 1 ? "grid-cols-2" : "grid-cols-1",
              )}
            >
              {weightOptions.map((option) => (
                <div
                  key={option.id}
                  className="relative overflow-hidden rounded-xl border border-tant-gold/20 bg-linear-to-br from-tant-green-deep/55 to-tant-green/25 shadow-inner shadow-black/10 transition-[border-color,transform] duration-200 hover:border-tant-gold/45"
                >
                  <div className="flex min-h-10 items-stretch">
                    <div className="flex flex-1 items-center justify-center px-2 py-2">
                      <span className="font-display text-xs leading-none text-tant-gold-bright">
                        {option.weight}
                      </span>
                    </div>
                    <div className="flex flex-1 items-center justify-center border-s border-tant-gold/15 bg-tant-green-deep/25 px-2 py-2">
                      <span className="text-sm font-semibold leading-none text-tant-cream">
                        {option.price} ر.س
                      </span>
                    </div>
                  </div>
                  {option.calories ? (
                    <div className="flex items-center justify-center gap-1 border-t border-tant-gold/10 px-2 py-1 text-[0.6rem] text-tant-muted">
                      <Flame
                        className="size-2.5 shrink-0 text-tant-gold/70"
                        aria-hidden
                      />
                      <span>{option.calories} سعرة</span>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className=" flex items-center justify-between gap-3">
            {item.calories != null && item.calories !== "" ? (
              <span className="inline-flex items-center gap-1 text-xs text-tant-muted">
                <Flame
                  className="size-3.5 shrink-0 text-tant-gold/80"
                  aria-hidden
                />
                <span>{item.calories} سعرة</span>
              </span>
            ) : (
              <span />
            )}
            {item.price != null ? (
              <span className="shrink-0 text-base font-medium text-tant-gold-bright">
                {item.price} ر.س
              </span>
            ) : null}
          </div>
        )}
      </div>

      {onAdd ? (
        <div className="border-t border-tant-gold/15 px-4 pb-4 pt-3">
          <button
            type="button"
            onClick={onAdd}
            className="btn-gold w-full rounded-lg px-4 py-2 text-sm"
          >
            أضف إلى الطلب
          </button>
        </div>
      ) : null}
    </article>
  )
}

export function MenuItemCardSkeleton() {
  return (
    <div className="glass-panel flex flex-col overflow-hidden rounded-2xl border border-tant-gold/25 shadow-md shadow-black/20">
      <div className="p-1">
        <div className="relative aspect-4/3 w-full overflow-hidden rounded-t-2xl">
          <Skeleton className="size-full" />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 px-4 py-3">
        <Skeleton className="h-5 w-2/3" />
        <div className="mt-auto flex items-center justify-between gap-3">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>
    </div>
  )
}

