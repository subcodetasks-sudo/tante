import { cn } from "@/lib/utils"
import type { MenuCategory, MenuItem } from "@/data/menu"
import { Heart } from "lucide-react"

const ribbonByCategory: Record<MenuCategory, string> = {
  // Keep category badge styling consistent across all cards.
  لفائف: "bg-tant-gold text-tant-green-deep",
  جانبية: "bg-tant-gold text-tant-green-deep",
  مشروبات: "bg-tant-gold text-tant-green-deep",
  حلويات: "bg-tant-gold text-tant-green-deep",
}

type MenuItemCardProps = {
  item: MenuItem
  className?: string
  onAdd?: () => void
  onFavorite?: () => void
  isFavorite?: boolean
}

export function MenuItemCard({
  item,
  className,
  onAdd,
  onFavorite,
  isFavorite = false,
}: MenuItemCardProps) {
  return (
    <article
      className={cn(
        "glass-panel group flex flex-col overflow-hidden rounded-2xl border border-tant-gold/25 shadow-md shadow-black/20 transition-shadow hover:shadow-lg hover:shadow-black/30",
        className,
      )}
    >
      <div className="p-1">
        <div className="relative flex aspect-4/3 w-full items-center justify-center overflow-hidden rounded-t-2xl bg-linear-to-b from-tant-green/35 to-tant-green-deep/65">
          <span className="font-display text-sm tracking-wider text-tant-gold/80">
            {item.imageLabel}
          </span>
          <button
            type="button"
            onClick={onFavorite}
            aria-label={isFavorite ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
            className={cn(
              "absolute inset-e-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/20 text-tant-cream transition-colors hover:bg-black/35",
              isFavorite && "bg-tant-gold/90 text-tant-green-deep hover:bg-tant-gold",
            )}
          >
            <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
          </button>
        </div>

        <div>
          <div
            className={cn(
              "rounded-b-full px-3 py-1 text-center text-[0.65rem] font-medium tracking-wide",
              ribbonByCategory[item.category],
            )}
          >
            {item.category}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <h3 className="min-w-0 truncate font-display text-base text-tant-cream">
          {item.name}
        </h3>
        <span className="shrink-0 text-sm font-medium text-tant-gold-bright">
          {item.price} SAR
        </span>
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
