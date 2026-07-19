import { cn } from "@/lib/utils"
import type { MenuItem } from "@/data/menu"

type MenuItemCardProps = {
  item: MenuItem
  className?: string
  onAdd?: () => void
}

export function MenuItemCard({ item, className, onAdd }: MenuItemCardProps) {
  return (
    <article
      className={cn(
        "glass-panel flex flex-col gap-3 overflow-hidden rounded-2xl p-3 sm:flex-row sm:items-stretch",
        className,
      )}
    >
      <div className="food-placeholder relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl sm:aspect-square sm:w-32 md:w-36">
        <span className="text-sm tracking-wider">{item.imageLabel}</span>
        <span className="absolute top-2 end-2 rounded-md bg-tant-gold px-2 py-0.5 text-xs font-medium text-tant-green">
          {item.price} SAR
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 py-1">
        <div>
          <h3 className="font-display text-lg text-tant-gold md:text-xl">
            {item.name}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-tant-cream/80">
            {item.description}
          </p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="btn-gold self-stretch rounded-lg px-4 py-2 text-sm sm:self-end"
        >
          أضف إلى الطلب
        </button>
      </div>
    </article>
  )
}
