import { useEffect, useRef, useState } from "react"
import { flushSync } from "react-dom"
import { Outlet, useLocation } from "react-router-dom"
import { Toaster } from "sonner"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { SiteLoadingScreen } from "@/components/SiteLoadingScreen"
import { useSiteStore } from "@/store/siteStore"

function revealWithViewTransition(update: () => void) {
  const doc = document as Document & {
    startViewTransition?: (callback: () => void) => { finished: Promise<void> }
  }

  if (typeof doc.startViewTransition !== "function") {
    update()
    return
  }

  document.documentElement.classList.add("boot-view-transition")
  const transition = doc.startViewTransition(() => {
    flushSync(update)
  })
  void transition.finished.finally(() => {
    document.documentElement.classList.remove("boot-view-transition")
  })
}

export default function RootLayout() {
  const { pathname } = useLocation()
  const siteStatus = useSiteStore((s) => s.status)
  const fetchSite = useSiteStore((s) => s.fetchAll)
  const [bootComplete, setBootComplete] = useState(() => {
    const status = useSiteStore.getState().status
    return status === "success" || status === "error"
  })
  const revealingRef = useRef(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    void fetchSite()
  }, [fetchSite])

  useEffect(() => {
    if (bootComplete || revealingRef.current) return
    if (siteStatus !== "success" && siteStatus !== "error") return

    revealingRef.current = true
    const onHome = pathname === "/"

    // Defer so the splash frame is committed before the view transition captures it.
    const id = window.requestAnimationFrame(() => {
      if (onHome) {
        revealWithViewTransition(() => setBootComplete(true))
        return
      }
      setBootComplete(true)
    })

    return () => window.cancelAnimationFrame(id)
  }, [siteStatus, bootComplete, pathname])

  const showHomeSplash = pathname === "/" && !bootComplete

  if (showHomeSplash) {
    return <SiteLoadingScreen />
  }

  return (
    <div className="site-shell">
      <Navbar />
      <main className="flex-1 pt-[5.25rem] md:pt-[6rem]">
        <Outlet />
      </main>
      <Footer />
      <Toaster
        position="bottom-center"
        theme="light"
        className="tant-toaster"
        toastOptions={{
          className: "tant-toast",
        }}
      />
    </div>
  )
}
