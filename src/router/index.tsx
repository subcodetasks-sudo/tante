import { createBrowserRouter } from "react-router-dom"
import RootLayout from "@/layout/RootLayout"
import LandingPage from "@/pages/LandingPage"
import MenuPage from "@/pages/MenuPage"
import FavoritesPage from "@/pages/FavoritesPage"
import NotFoundPage from "@/pages/NotFoundPage"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "menu", element: <MenuPage /> },
      { path: "favorites", element: <FavoritesPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
])
