import { useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { Toaster } from "sonner"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { useMenuStore } from "@/store/menuStore"
import { useSiteStore } from "@/store/siteStore"

export default function RootLayout() {
  const { pathname } = useLocation()
  const fetchMenu = useMenuStore((s) => s.fetchMenu)
  const fetchMostOrdered = useMenuStore((s) => s.fetchMostOrdered)
  const fetchSite = useSiteStore((s) => s.fetchAll)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    void fetchMenu()
    void fetchMostOrdered()
    void fetchSite()
  }, [fetchMenu, fetchMostOrdered, fetchSite])

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
