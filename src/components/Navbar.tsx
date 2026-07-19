import { Link, NavLink, useLocation } from "react-router-dom"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const sectionLinks = [
  { label: "من نحن", hash: "about" },
  { label: "القائمة", to: "/menu" as const },
  { label: "الفروع", hash: "locations" },
  { label: "آراء العملاء", hash: "feedback" },
] as const

function sectionHref(hash: string) {
  return `/#${hash}`
}

const linkBase =
  "site-header__link font-display text-sm tracking-wide md:text-base"
const WHATSAPP_NUMBER = ""
const whatsappHref = WHATSAPP_NUMBER
  ? `https://wa.me/${WHATSAPP_NUMBER}`
  : "https://wa.me/"


/** Backdrop-filter + :focus paints a square glitch — drop mouse/touch focus after press. */
function blurNavLink(e: React.PointerEvent<HTMLAnchorElement>) {
  if (
    e.pointerType === "mouse" ||
    e.pointerType === "touch" ||
    e.pointerType === "pen"
  ) {
    e.currentTarget.blur()
  }
}

export function Navbar() {
  const location = useLocation()
  const onHome = location.pathname === "/"

  return (
    <header className="site-header fixed inset-x-0 top-0 z-50 px-4 pt-3.5 md:px-8">
      <nav
        className="site-header__glass mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-2"
        aria-label="القائمة الرئيسية"
      >
        <Link
          to="/"
          viewTransition={true}
          className="justify-self-start"
          aria-label="الصفحة الرئيسية — تنت"
          onPointerUp={blurNavLink}
        >
          <img
            src="/logo.webp"
            alt="تنت"
            className="site-header__logo h-10 w-10 object-contain md:h-11 md:w-11"
          />
        </Link>

        <ul className="flex flex-wrap items-center justify-center gap-1 md:gap-1.5">
          {sectionLinks.map((link) => {
            if ("to" in link) {
              return (
                <li key={link.label}>
                  <NavLink
                    to={link.to}
                    viewTransition={true}
                    onPointerUp={blurNavLink}
                    className={({ isActive }) =>
                      cn(linkBase, isActive && "site-header__link--active")
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              )
            }

            const href = sectionHref(link.hash)
            const isSectionActive =
              onHome && location.hash === `#${link.hash}`

            return (
              <li key={link.label}>
                <Link
                  to={href}
                  viewTransition={true}
                  onPointerUp={blurNavLink}
                  className={cn(
                    linkBase,
                    isSectionActive && "site-header__link--active",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center justify-self-end gap-1 md:gap-1.5">

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onPointerUp={blurNavLink}
            className={cn(linkBase, "shrink-0 whitespace-nowrap")}
          >
            تواصل معنا
          </a>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                delay={300}
                render={(props) => (
                  <NavLink
                    {...props}
                    to="/favorites"
                    viewTransition={true}
                    onPointerUp={blurNavLink}
                    aria-label="المفضلة"
                    className={({ isActive }) =>
                      cn(
                        props.className,
                        "site-header__fav inline-flex size-10 shrink-0 items-center justify-center md:size-11",
                        isActive && "site-header__fav--active",
                      )
                    }
                  />
                )}
              >
                <Heart className="size-5 text-tant-gold" strokeWidth={1.75} />
              </TooltipTrigger>
              <TooltipContent side="bottom">المفضلة</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </nav>
    </header>
  )
}
