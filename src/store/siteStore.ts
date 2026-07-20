import { create } from "zustand"
import { apiFetch } from "@/lib/api"
import type { About, Branch, Settings, Testimonial } from "@/types/api"

type LoadStatus = "idle" | "loading" | "success" | "error"

type SiteState = {
  settings: Settings | null
  about: About | null
  branches: Branch[]
  testimonials: Testimonial[]
  status: LoadStatus
  error: string | null
  fetchSettings: () => Promise<void>
  fetchAbout: () => Promise<void>
  fetchBranches: () => Promise<void>
  fetchTestimonials: () => Promise<void>
  fetchAll: () => Promise<void>
}

async function loadResource<T>(
  path: string,
  onSuccess: (data: T) => void,
): Promise<void> {
  const data = await apiFetch<T>(path)
  onSuccess(data)
}

export const useSiteStore = create<SiteState>((set, get) => ({
  settings: null,
  about: null,
  branches: [],
  testimonials: [],
  status: "idle",
  error: null,

  fetchSettings: async () => {
    await loadResource<Settings>("/api/settings", (settings) =>
      set({
        settings: {
          ...settings,
          logo: settings.logo || "/logo.png",
        },
      }),
    )
  },

  fetchAbout: async () => {
    await loadResource<About>("/api/about", (about) => set({ about }))
  },

  fetchBranches: async () => {
    await loadResource<Branch[]>("/api/branches", (branches) =>
      set({ branches }),
    )
  },

  fetchTestimonials: async () => {
    await loadResource<Testimonial[]>("/api/testimonials", (testimonials) =>
      set({ testimonials }),
    )
  },

  fetchAll: async () => {
    const { status } = get()
    if (status === "loading") return
    if (
      status === "success" &&
      get().settings &&
      get().about &&
      get().branches.length > 0
    ) {
      return
    }

    set({ status: "loading", error: null })
    try {
      await Promise.all([
        get().fetchSettings(),
        get().fetchAbout(),
        get().fetchBranches(),
        get().fetchTestimonials(),
      ])
      set({ status: "success" })
    } catch (err) {
      set({
        status: "error",
        error: err instanceof Error ? err.message : "تعذر تحميل بيانات الموقع",
      })
    }
  },
}))
