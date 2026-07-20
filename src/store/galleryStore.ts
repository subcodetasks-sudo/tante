import { create } from "zustand"
import { apiFetch } from "@/lib/api"
import type { GalleryItem } from "@/types/api"

type LoadStatus = "idle" | "loading" | "success" | "error"

type GalleryState = {
  items: GalleryItem[]
  status: LoadStatus
  error: string | null
  fetchGallery: () => Promise<void>
}

export const useGalleryStore = create<GalleryState>((set, get) => ({
  items: [],
  status: "idle",
  error: null,

  fetchGallery: async () => {
    const { status, items } = get()
    if (status === "loading") return
    if (status === "success" && items.length > 0) return

    set({ status: "loading", error: null })
    try {
      const data = await apiFetch<GalleryItem[]>("/api/galleries")
      const sorted = [...data].sort((a, b) => a.sort_order - b.sort_order)
      set({ items: sorted, status: "success" })
    } catch (err) {
      set({
        status: "error",
        error: err instanceof Error ? err.message : "تعذر تحميل المعرض",
      })
    }
  },
}))
