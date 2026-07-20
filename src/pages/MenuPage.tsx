import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import {
  CategoryDropdown,
  CategorySidebar,
} from "@/components/CategoryFilter"
import { MenuItemCard, MenuItemCardSkeleton } from "@/components/MenuItemCard"
import { useMenuStore } from "@/store/menuStore"
import { Skeleton } from "@/components/ui/skeleton"

export default function MenuPage() {
  const categories = useMenuStore((s) => s.categories)
  const status = useMenuStore((s) => s.status)
  const error = useMenuStore((s) => s.error)
  const fetchMenu = useMenuStore((s) => s.fetchMenu)
  const [categoryId, setCategoryId] = useState<number | null>(null)

  useEffect(() => {
    void fetchMenu()
  }, [fetchMenu])

  useEffect(() => {
    if (categories.length === 0) return
    if (categoryId == null || !categories.some((c) => c.id === categoryId)) {
      setCategoryId(categories[0].id)
    }
  }, [categories, categoryId])

  const activeCategory = useMemo(
    () => categories.find((c) => c.id === categoryId) ?? categories[0],
    [categories, categoryId],
  )

  const filtered = activeCategory?.products ?? []

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [categoryId])

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
            onSelect={setCategoryId}
          />

          <div className="mx-auto max-w-6xl px-4 pb-10 pt-16 md:px-8 md:py-14">
            <div className="flex flex-col gap-8 md:flex-row md:gap-10">
              <aside className="hidden md:block md:w-48 md:shrink-0">
                <CategorySidebar
                  categories={categories}
                  categoryId={activeCategory.id}
                  onSelect={setCategoryId}
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
