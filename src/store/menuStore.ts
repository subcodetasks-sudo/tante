import { create } from "zustand"
import { apiFetch } from "@/lib/api"
import type { MenuCategory, MostOrdered, Product } from "@/types/api"

type LoadStatus = "idle" | "loading" | "success" | "error"

type MenuState = {
  categories: MenuCategory[]
  mostOrdered: MostOrdered | null
  status: LoadStatus
  mostOrderedStatus: LoadStatus
  error: string | null
  fetchMenu: () => Promise<void>
  fetchMostOrdered: () => Promise<void>
  products: () => Product[]
}

export const useMenuStore = create<MenuState>((set, get) => ({
  categories: [],
  mostOrdered: null,
  status: "idle",
  mostOrderedStatus: "idle",
  error: null,

  fetchMenu: async () => {
    const { status, categories } = get()
    if (status === "loading") return
    if (status === "success" && categories.length > 0) return

    set({ status: "loading", error: null })
    try {
      const data = await apiFetch<MenuCategory[]>("/api/menu")
      set({ categories: data, status: "success" })
    } catch (err) {
      set({
        status: "error",
        error: err instanceof Error ? err.message : "تعذر تحميل القائمة",
      })
    }
  },

  fetchMostOrdered: async () => {
    const { mostOrderedStatus, mostOrdered } = get()
    if (mostOrderedStatus === "loading") return
    if (mostOrderedStatus === "success" && mostOrdered) return

    set({ mostOrderedStatus: "loading" })
    try {
      const data = await apiFetch<MostOrdered>("/api/most-ordered")
      set({ mostOrdered: data, mostOrderedStatus: "success" })
    } catch (err) {
      set({
        mostOrderedStatus: "error",
        error: err instanceof Error ? err.message : "تعذر تحميل الأكثر طلباً",
      })
    }
  },

  products: () => get().categories.flatMap((category) => category.products),
}))
