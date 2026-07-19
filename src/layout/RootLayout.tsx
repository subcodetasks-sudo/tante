import { Outlet } from "react-router-dom"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"

export default function RootLayout() {
  return (
    <div className="site-shell">
      <Navbar />
      <main className="flex-1 pt-20 md:pt-[5.5rem]">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
