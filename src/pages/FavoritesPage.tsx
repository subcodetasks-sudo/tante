import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { AnimatePresence, motion } from "motion/react"
import { Heart } from "lucide-react"
import {
  CategoryDropdown,
  CategorySidebar,
  type CategoryOption,
} from "@/components/CategoryFilter"
import { MenuItemCard, MenuItemCardSkeleton } from "@/components/MenuItemCard"
import { useFavoritesStore } from "@/store/favoritesStore"
import { useMenuStore } from "@/store/menuStore"
import type { Product } from "@/types/api"
import { Skeleton } from "@/components/ui/skeleton"

const ALL_FILTER_ID = -1

function productCategoryId(product: Product): number | null {
  const raw = product.category_id ?? product.category?.id
  if (raw == null) return null
  const id = typeof raw === "number" ? raw : Number(raw)
  return Number.isFinite(id) ? id : null
}

export default function FavoritesPage() {
  const favoriteIds = useFavoritesStore((s) => s.ids)
  const favoriteItems = useFavoritesStore((s) => s.items)
  const categories = useMenuStore((s) => s.categories)
  const status = useMenuStore((s) => s.status)
  const error = useMenuStore((s) => s.error)
  const fetchMenu = useMenuStore((s) => s.fetchMenu)
  const [categoryId, setCategoryId] = useState(ALL_FILTER_ID)

  useEffect(() => {
    void fetchMenu()
  }, [fetchMenu])

  const favoriteProducts = useMemo(() => {
    if (favoriteIds.length === 0) return []

    const menuById = new Map<number, Product>()
    for (const category of categories) {
      for (const product of category.products ?? []) {
        const id = Number(product.id)
        if (!Number.isFinite(id)) continue
        menuById.set(id, {
          ...product,
          id,
          category_id: product.category_id ?? category.id,
          category: product.category ?? {
            id: category.id,
            name_ar: category.name_ar,
            name_en: category.name_en,
          },
        })
      }
    }

    return favoriteIds
      .map((id) => {
        const fromMenu = menuById.get(id)
        if (fromMenu) return fromMenu
        return favoriteItems.find((item) => item.id === id) ?? null
      })
      .filter((product): product is Product => product != null)
  }, [favoriteIds, favoriteItems, categories])

  const filterCategories = useMemo((): CategoryOption[] => {
    const usedIds = new Set(
      favoriteProducts
        .map(productCategoryId)
        .filter((id): id is number => id != null),
    )
    const used = categories
      .filter((category) => usedIds.has(category.id))
      .map((category) => ({ id: category.id, name_ar: category.name_ar }))

    // Include categories only present on stored favorite snapshots
    for (const product of favoriteProducts) {
      const id = productCategoryId(product)
      if (id == null || usedIds.has(id)) continue
      const name =
        product.category?.name_ar?.trim() ||
        product.category?.name_en?.trim()
      if (!name) continue
      usedIds.add(id)
      used.push({ id, name_ar: name })
    }

    return [{ id: ALL_FILTER_ID, name_ar: "الكل" }, ...used]
  }, [categories, favoriteProducts])

  useEffect(() => {
    if (!filterCategories.some((category) => category.id === categoryId)) {
      setCategoryId(ALL_FILTER_ID)
    }
  }, [categoryId, filterCategories])

  const filteredProducts = useMemo(() => {
    if (categoryId === ALL_FILTER_ID) return favoriteProducts
    return favoriteProducts.filter(
      (product) => productCategoryId(product) === categoryId,
    )
  }, [favoriteProducts, categoryId])

  const activeCategoryName =
    filterCategories.find((c) => c.id === categoryId)?.name_ar ?? "الكل"

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [categoryId])

  return (
    <AnimatePresence mode="wait">
      {status === "loading" && categories.length === 0 && favoriteItems.length === 0 ? (
        <motion.div
          key="skeleton"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="mx-auto max-w-6xl px-4 pb-16 pt-24 md:px-8"
        >
          <div className="space-y-6">
            <div>
              <Skeleton className="h-10 w-48 rounded-xl" />
              <Skeleton className="mt-2 h-4 w-72 rounded-lg" />
            </div>

            {/* Category Filter Skeletons */}
            <div className="flex flex-wrap gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-20 rounded-full" />
              ))}
            </div>

            {/* Grid of Card Skeletons */}
            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3 mt-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <MenuItemCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </motion.div>
      ) : status === "error" && categories.length === 0 && favoriteIds.length === 0 ? (
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
      ) : favoriteIds.length === 0 ? (
        <motion.div
          key="empty"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="flex min-h-[70svh] flex-col items-center justify-center px-4 py-16 text-center"
        >
          <div className="flex flex-col items-center gap-5">
            <div className="flex size-20 items-center justify-center rounded-full border border-[rgba(90,120,85,0.55)] bg-[rgba(46,71,42,0.45)]">
              <Heart className="size-9 text-tant-gold" strokeWidth={1.5} />
            </div>
            <h1 className="font-arabic text-3xl text-tant-gold md:text-4xl">
              المفضلة
            </h1>
            <p className="max-w-sm text-base text-tant-gold-soft/90">
              لم حفظ أي أطباق بعد — أضف مفضلاتك من القائمة لتظهر هنا.
            </p>
            <Link
              to="/menu"
              viewTransition={true}
              className="btn-gold mt-2 rounded-full px-8 py-2.5 font-arabic text-lg"
            >
              تصفح القائمة
            </Link>
          </div>
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
            categories={filterCategories}
            categoryId={categoryId}
            categoryName={activeCategoryName}
            onSelect={setCategoryId}
            label="تصفية المفضلة حسب الفئة"
            listLabel="فئات المفضلة"
          />

          <div className="mx-auto max-w-6xl px-4 pb-10 pt-16 md:px-8 md:py-14">
            <div className="flex flex-col gap-8 md:flex-row md:gap-10">
              <aside className="hidden md:block md:w-48 md:shrink-0">
                <CategorySidebar
                  categories={filterCategories}
                  categoryId={categoryId}
                  onSelect={setCategoryId}
                  label="فئات المفضلة"
                />
              </aside>

              <div className="min-w-0 flex-1 space-y-6">
                <div>
                  <h1 className="font-display text-3xl text-tant-gold md:text-4xl">
                    {activeCategoryName === "الكل" ? "المفضلة" : activeCategoryName}
                  </h1>
                  <p className="mt-1 text-sm text-tant-muted">
                    أطباقك المحفوظة — صفّها حسب الفئة أو اعرض الكل.
                  </p>
                </div>

                <motion.div
                  key={categoryId}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3"
                >
                  {filteredProducts.map((item) => (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      categoryId={productCategoryId(item) ?? undefined}
                      categoryName={
                        item.category?.name_ar ??
                        categories.find((c) => c.id === productCategoryId(item))
                          ?.name_ar
                      }
                    />
                  ))}
                </motion.div>

                {filteredProducts.length === 0 && (
                  <p className="text-center text-tant-muted">
                    لا توجد مفضلات في فئة «{activeCategoryName}».
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
