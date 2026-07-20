import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import type { Product } from "@/types/api"

const STORAGE_KEY = "tant-favorites"

export type FavoriteItem = Product & {
  category_id?: number
  category?: {
    id: number
    name_ar: string
    name_en: string
  }
}

type FavoritesState = {
  ids: number[]
  items: FavoriteItem[]
  isFavorite: (id: number) => boolean
  toggleFavorite: (product: Product, category?: FavoriteItem["category"]) => void
  removeFavorite: (id: number) => void
}

function normalizeId(value: unknown): number | null {
  const id = typeof value === "number" ? value : Number(value)
  return Number.isFinite(id) ? id : null
}

function normalizeIds(ids: unknown): number[] {
  if (!Array.isArray(ids)) return []
  const unique = new Set<number>()
  for (const value of ids) {
    const id = normalizeId(value)
    if (id != null) unique.add(id)
  }
  return [...unique]
}

function normalizeItems(items: unknown, ids: number[]): FavoriteItem[] {
  if (!Array.isArray(items)) return []
  const byId = new Map<number, FavoriteItem>()
  for (const item of items) {
    if (!item || typeof item !== "object") continue
    const id = normalizeId((item as FavoriteItem).id)
    if (id == null) continue
    byId.set(id, { ...(item as FavoriteItem), id })
  }
  return ids.map((id) => byId.get(id)).filter((item): item is FavoriteItem => item != null)
}

function readStoredState(): { ids: number[]; items: FavoriteItem[] } {
  if (typeof window === "undefined") return { ids: [], items: [] }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ids: [], items: [] }
    const parsed = JSON.parse(raw) as {
      state?: { ids?: unknown; items?: unknown }
      ids?: unknown
      items?: unknown
    }
    const state = parsed.state ?? parsed
    const ids = normalizeIds(state.ids)
    const items = normalizeItems(state.items, ids)
    return { ids, items }
  } catch {
    return { ids: [], items: [] }
  }
}

const initial = readStoredState()

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: initial.ids,
      items: initial.items,

      isFavorite: (id) => {
        const productId = normalizeId(id)
        if (productId == null) return false
        return get().ids.includes(productId)
      },

      toggleFavorite: (product, category) => {
        const productId = normalizeId(product.id)
        if (productId == null) return

        const { ids, items } = get()
        if (ids.includes(productId)) {
          set({
            ids: ids.filter((id) => id !== productId),
            items: items.filter((item) => item.id !== productId),
          })
          return
        }

        const entry: FavoriteItem = {
          ...product,
          id: productId,
          category_id: product.category_id ?? category?.id,
          category: product.category ?? category,
        }

        set({
          ids: [...ids, productId],
          items: [...items.filter((item) => item.id !== productId), entry],
        })
      },

      removeFavorite: (id) => {
        const productId = normalizeId(id)
        if (productId == null) return
        set({
          ids: get().ids.filter((favoriteId) => favoriteId !== productId),
          items: get().items.filter((item) => item.id !== productId),
        })
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ ids: state.ids, items: state.items }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as
          | { ids?: unknown; items?: unknown }
          | undefined
        const ids = normalizeIds(persisted?.ids ?? currentState.ids)
        const items = normalizeItems(
          persisted?.items ?? currentState.items,
          ids,
        )
        return {
          ...currentState,
          ids,
          items,
        }
      },
    },
  ),
)
