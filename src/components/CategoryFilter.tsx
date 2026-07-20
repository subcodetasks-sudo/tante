import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "motion/react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export type CategoryOption = {
  id: number
  name_ar: string
}

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

export function CategorySidebar({
  categories,
  categoryId,
  onSelect,
  label = "فئات القائمة",
}: {
  categories: CategoryOption[]
  categoryId: number
  onSelect: (id: number) => void
  label?: string
}) {
  return (
    <nav className="glass-panel sticky top-28 rounded-2xl p-2" aria-label={label}>
      <ul className="flex flex-col gap-1">
        {categories.map((cat) => (
          <li key={cat.id}>
            <button
              type="button"
              onClick={() => onSelect(cat.id)}
              className={cn(
                "w-full rounded-xl px-4 py-2.5 text-start text-base transition-colors",
                categoryId === cat.id
                  ? "btn-gold"
                  : "text-tant-cream/85 hover:bg-tant-gold/10 hover:text-tant-gold",
              )}
            >
              {cat.name_ar}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export function CategoryDropdown({
  categories,
  categoryId,
  categoryName,
  onSelect,
  label = "اختر فئة القائمة",
  listLabel = "فئات القائمة",
}: {
  categories: CategoryOption[]
  categoryId: number
  categoryName: string
  onSelect: (id: number) => void
  label?: string
  listLabel?: string
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
          className="glass-panel menu-cats-fixed__trigger mx-auto flex w-[96%] items-center justify-between gap-3 px-4 py-3 text-start"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={label}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="font-display text-base text-tant-gold">
            {categoryName}
          </span>
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
              aria-label={listLabel}
              variants={dropdownPanel}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {categories.map((cat) => {
                const selected = categoryId === cat.id
                return (
                  <motion.li
                    key={cat.id}
                    role="option"
                    aria-selected={selected}
                    variants={dropdownItem}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        onSelect(cat.id)
                        setOpen(false)
                      }}
                      className={cn(
                        "w-full rounded-xl px-4 py-2.5 text-start text-sm transition-colors",
                        selected
                          ? "btn-gold"
                          : "text-tant-cream/85 hover:bg-tant-gold/10 hover:text-tant-gold",
                      )}
                    >
                      {cat.name_ar}
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
