import { useEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "motion/react"
import { ChevronDown } from "lucide-react"
import {
  menuCategories,
  menuItems,
  type MenuCategory,
} from "@/data/menu"
import { MenuItemCard } from "@/components/MenuItemCard"
import { cn } from "@/lib/utils"

const dropdownEase = [0.22, 1, 0.36, 1] as const

const dropdownPanel = {
  hidden: {
    opacity: 0,
    y: -4,
    scaleY: 0.96,
    transition: { duration: 0.15, ease: dropdownEase },
  },
  visible: {
    opacity: 1,
    y: 0,
    scaleY: 1,
    transition: {
      duration: 0.22,
      ease: dropdownEase,
      when: "beforeChildren" as const,
      staggerChildren: 0.035,
      delayChildren: 0.025,
    },
  },
  exit: {
    opacity: 0,
    y: -4,
    scaleY: 0.98,
    transition: {
      duration: 0.14,
      ease: dropdownEase,
      when: "afterChildren" as const,
      staggerChildren: 0.02,
      staggerDirection: -1,
    },
  },
}

const dropdownItem = {
  hidden: { opacity: 0, y: -6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.18, ease: dropdownEase },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: { duration: 0.1, ease: dropdownEase },
  },
}

function CategorySidebar({
  category,
  onSelect,
}: {
  category: MenuCategory
  onSelect: (cat: MenuCategory) => void
}) {
  return (
    <ul className="flex flex-col gap-1">
      {menuCategories.map((cat) => (
        <li key={cat}>
          <button
            type="button"
            onClick={() => onSelect(cat)}
            className={cn(
              "w-full rounded-xl px-4 py-2.5 text-start text-base transition-colors",
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
  )
}

function CategoryDropdown({
  category,
  onSelect,
}: {
  category: MenuCategory
  onSelect: (cat: MenuCategory) => void
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }

    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  return createPortal(
    <div
      ref={rootRef}
      className="menu-cats-fixed fixed inset-x-0 z-40 px-4 md:hidden"
    >
      <div className="relative mx-auto max-w-6xl">
        <button
          type="button"
          className="glass-panel menu-cats-fixed__trigger flex w-[96%] mx-auto items-center justify-between gap-3 px-4 py-3 text-start"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label="اختر فئة القائمة"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="font-display text-base text-tant-gold">{category}</span>
          <ChevronDown
            className={cn(
              "size-5 shrink-0 text-tant-gold transition-transform duration-200",
              open && "rotate-180",
            )}
            aria-hidden
          />
        </button>

        <AnimatePresence>
          {open && (
            <motion.ul
              key="category-menu"
              className="glass-panel menu-cats-fixed__panel absolute inset-x-0 top-full z-10 mx-auto mt-1.5 w-[96%] origin-top overflow-hidden rounded-2xl p-1.5 shadow-lg shadow-black/30"
              role="listbox"
              aria-label="فئات القائمة"
              variants={dropdownPanel}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {menuCategories.map((cat) => {
                const selected = category === cat
                return (
                  <motion.li
                    key={cat}
                    role="option"
                    aria-selected={selected}
                    variants={dropdownItem}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        onSelect(cat)
                        setOpen(false)
                      }}
                      className={cn(
                        "w-full rounded-xl px-4 py-2.5 text-start text-sm transition-colors",
                        selected
                          ? "btn-gold"
                          : "text-tant-cream/85 hover:bg-tant-gold/10 hover:text-tant-gold",
                      )}
                    >
                      {cat}
                    </button>
                  </motion.li>
                )
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>,
    document.body,
  )
}

export default function MenuPage() {
  const [category, setCategory] = useState<MenuCategory>("لفائف")

  const filtered = useMemo(
    () => menuItems.filter((item) => item.category === category),
    [category],
  )

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [category])

  return (
    <>
      <CategoryDropdown category={category} onSelect={setCategory} />

      <div className="mx-auto max-w-6xl px-4 pb-10 pt-16 md:px-8 md:py-14">
        <div className="flex flex-col gap-8 md:flex-row md:gap-10">
          <aside className="hidden md:block md:w-48 md:shrink-0">
            <nav
              className="glass-panel sticky top-28 rounded-2xl p-2"
              aria-label="فئات القائمة"
            >
              <CategorySidebar category={category} onSelect={setCategory} />
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
      </div>
    </>
  )
}
