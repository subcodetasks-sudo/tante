import { useMemo, useState } from "react"
import { motion } from "motion/react"
import {
  menuCategories,
  menuItems,
  type MenuCategory,
} from "@/data/menu"
import { MenuItemCard } from "@/components/MenuItemCard"
import { cn } from "@/lib/utils"

export default function MenuPage() {
  const [category, setCategory] = useState<MenuCategory>("لفائف")

  const filtered = useMemo(
    () => menuItems.filter((item) => item.category === category),
    [category],
  )

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 md:flex-row md:gap-10 md:px-8 md:py-14">
      <aside className="md:w-48 md:shrink-0">
        <nav
          className="glass-panel sticky top-28 rounded-2xl p-2"
          aria-label="فئات القائمة"
        >
          <ul className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
            {menuCategories.map((cat) => (
              <li key={cat} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={cn(
                    "w-full rounded-xl px-4 py-2.5 text-start text-sm transition-colors md:text-base",
                    category === cat
                      ? "btn-gold"
                      : "text-tant-cream/85 hover:bg-tant-gold/10 hover:text-tant-gold",
                  )}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className="min-w-0 flex-1 space-y-6">
        <div>
          <h1 className="font-display text-3xl text-tant-gold md:text-4xl">
            {category}
          </h1>
          <p className="mt-1 text-sm text-tant-muted">
            اختر مفضلاتك وأضفها إلى طلبك.
          </p>
        </div>

        <motion.div
          key={category}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3"
        >
          {filtered.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <p className="text-center text-tant-muted">
            لا يوجد شيء في هذه الفئة بعد — نعود قريباً.
          </p>
        )}
      </div>
    </div>
  )
}
