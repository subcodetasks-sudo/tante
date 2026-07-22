import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { AnimatePresence, motion } from "motion/react"
import {
  CategoryDropdown,
  CategorySidebar,
} from "@/components/CategoryFilter"
import { MenuItemCard, MenuItemCardSkeleton } from "@/components/MenuItemCard"
import { useMenuStore } from "@/store/menuStore"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

function parsePositiveInt(value: string | null) {
  if (!value) return null
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}

export default function MenuPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const categories = useMenuStore((s) => s.categories)
  const status = useMenuStore((s) => s.status)
  const error = useMenuStore((s) => s.error)
  const fetchMenu = useMenuStore((s) => s.fetchMenu)
  const categoryFromQuery = parsePositiveInt(searchParams.get("category"))
  const productFromQuery = parsePositiveInt(searchParams.get("product"))

  const [highlightedProductId, setHighlightedProductId] = useState<number | null>(
    productFromQuery,
  )
  const [prevProductQuery, setPrevProductQuery] = useState<number | null>(
    productFromQuery,
  )

  // Adjust highlight during render when the URL product changes (no sync effect).
  if (productFromQuery !== prevProductQuery) {
    setPrevProductQuery(productFromQuery)
    if (productFromQuery != null) {
      setHighlightedProductId(productFromQuery)
    }
  }

  useEffect(() => {
    void fetchMenu()
  }, [fetchMenu])

  const activeCategory = useMemo(() => {
    if (categories.length === 0) return undefined
    if (
      categoryFromQuery != null &&
      categories.some((c) => c.id === categoryFromQuery)
    ) {
      return categories.find((c) => c.id === categoryFromQuery)
    }
    return categories[0]
  }, [categories, categoryFromQuery])

  const filtered = activeCategory?.products ?? []

  // Only jump to top on category changes — never after a product deep-link.
  useEffect(() => {
    if (highlightedProductId != null || productFromQuery != null) return
    window.scrollTo(0, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- category change only
  }, [activeCategory?.id])

  useEffect(() => {
    if (productFromQuery == null || !activeCategory) return
    if (categoryFromQuery != null && activeCategory.id !== categoryFromQuery) {
      return
    }

    let cancelled = false
    let attempts = 0
    let retryTimer = 0

    const scrollToProduct = () => {
      if (cancelled) return
      const el = document.getElementById(`menu-item-${productFromQuery}`)
      if (!el) {
        attempts += 1
        if (attempts < 12) {
          retryTimer = window.setTimeout(scrollToProduct, 80)
        }
        return
      }
      el.scrollIntoView({ behavior: "smooth", block: "center" })
    }

    const scrollTimer = window.setTimeout(scrollToProduct, 320)

    return () => {
      cancelled = true
      window.clearTimeout(scrollTimer)
      window.clearTimeout(retryTimer)
    }
  }, [
    productFromQuery,
    categoryFromQuery,
    activeCategory,
    filtered.length,
  ])

  useEffect(() => {
    if (highlightedProductId == null) return

    const clearHighlight = window.setTimeout(() => {
      setHighlightedProductId(null)
      setSearchParams(
        (prev) => {
          if (!prev.has("product")) return prev
          const next = new URLSearchParams(prev)
          next.delete("product")
          return next
        },
        { replace: true },
      )
    }, 2800)

    return () => window.clearTimeout(clearHighlight)
  }, [highlightedProductId, setSearchParams])

  const handleSelectCategory = (id: number) => {
    setHighlightedProductId(null)
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.set("category", String(id))
        next.delete("product")
        return next
      },
      { replace: true },
    )
  }

  return (
    <>
      <title>القائمة — طنط</title>
      <AnimatePresence mode="wait">
      {status === "loading" && categories.length === 0 ? (
        <motion.div
          key="skeleton"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {/* Mobile Dropdown Skeleton */}
          <div className="md:hidden border-b border-tant-gold/10 px-4 py-3 bg-tant-green-deep">
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>

          <div className="mx-auto max-w-6xl px-4 pb-10 pt-16 md:px-8 md:py-14">
            <div className="flex flex-col gap-8 md:flex-row md:gap-10">
              {/* Desktop Sidebar Skeleton */}
              <aside className="hidden md:block md:w-48 md:shrink-0 space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full rounded-xl" />
                ))}
              </aside>

              {/* Content Area Skeleton */}
              <div className="min-w-0 flex-1 space-y-6">
                <div>
                  <Skeleton className="h-10 w-48 rounded-xl" />
                  <Skeleton className="mt-2 h-4 w-72 rounded-lg" />
                </div>

                <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <MenuItemCardSkeleton key={i} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : status === "error" && categories.length === 0 ? (
        <motion.div
          key="error"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="mx-auto max-w-6xl px-4 py-20 text-center text-tant-muted"
        >
          {error ?? "تعذر تحميل القائمة"}
        </motion.div>
      ) : !activeCategory ? (
        <motion.div
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="mx-auto max-w-6xl px-4 py-20 text-center text-tant-muted"
        >
          لا توجد أصناف في القائمة بعد.
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <CategoryDropdown
            categories={categories}
            categoryId={activeCategory.id}
            categoryName={activeCategory.name_ar}
            onSelect={handleSelectCategory}
          />

          <div className="mx-auto max-w-6xl px-4 pb-10 pt-16 md:px-8 md:py-14">
            <div className="flex flex-col gap-8 md:flex-row md:gap-10">
              <aside className="hidden md:block md:w-48 md:shrink-0">
                <CategorySidebar
                  categories={categories}
                  categoryId={activeCategory.id}
                  onSelect={handleSelectCategory}
                />
              </aside>

              <div className="min-w-0 flex-1 space-y-6">
                <div>
                  <h1 className="font-display text-3xl text-tant-gold md:text-4xl">
                    {activeCategory.name_ar}
                  </h1>
                  <p className="mt-1 text-sm text-tant-muted">
                    اختر مفضلاتك وأضفها إلى طلبك.
                  </p>
                </div>

                <motion.div
                  key={activeCategory.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3"
                >
                  {filtered.map((item) => (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      categoryId={activeCategory.id}
                      categoryName={activeCategory.name_ar}
                      className={cn(
                        highlightedProductId === item.id &&
                          "menu-item-card--search-hit",
                      )}
                    />
                  ))}
                </motion.div>

                {filtered.length === 0 && (
                  <p className="text-center text-tant-muted">
                    لا يوجد شيء في هذه الفئة بعد — نعود قريباً.
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  )
}
