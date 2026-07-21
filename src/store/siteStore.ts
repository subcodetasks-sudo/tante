import { create } from "zustand"
import { apiFetch } from "@/lib/api"
import type { About, Branch, BranchContent, Hero, Settings, Testimonial } from "@/types/api"

type LoadStatus = "idle" | "loading" | "success" | "error"

type SiteState = {
  settings: Settings | null
  hero: Hero | null
  about: About | null
  branchContent: BranchContent | null
  branches: Branch[]
  testimonials: Testimonial[]
  status: LoadStatus
  error: string | null
  fetchSettings: () => Promise<void>
  fetchHero: () => Promise<void>
  fetchAbout: () => Promise<void>
  fetchBranchContent: () => Promise<void>
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
  hero: null,
  about: null,
  branchContent: null,
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

  fetchHero: async () => {
    await loadResource<Hero>("/api/hero", (hero) => set({ hero }))
  },

  fetchAbout: async () => {
    await loadResource<About>("/api/about", (about) => set({ about }))
  },

  fetchBranchContent: async () => {
    await loadResource<BranchContent>("/api/branch-content", (branchContent) =>
      set({ branchContent }),
    )
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
      get().hero &&
      get().about &&
      get().branchContent &&
      get().branches.length > 0
    ) {
      return
    }

    set({ status: "loading", error: null })
    try {
      await Promise.all([
        get().fetchSettings(),
        get().fetchHero(),
        get().fetchAbout(),
        get().fetchBranchContent(),
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
