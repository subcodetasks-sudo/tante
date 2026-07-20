import { Outlet } from "react-router-dom"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"

export default function RootLayout() {
  return (
    <div className="site-shell">
      <Navbar />
      <main className="flex-1 pt-[5.25rem] md:pt-[6rem]">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
