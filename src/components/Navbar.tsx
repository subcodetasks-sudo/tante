import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import { Link, NavLink, useLocation } from "react-router-dom"
import { FaWhatsapp } from "react-icons/fa"
import { gsap } from "gsap"
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
  { label: "المعرض", to: "/gallery" as const },
  { label: "الفروع", hash: "locations" },
  { label: "آراء العملاء", hash: "feedback" },
] as const

function sectionHref(hash: string) {
  return `/#${hash}`
}

const linkBase =
  "site-header__link font-display text-sm tracking-wide md:text-base"

const contactCtaBase =
  "site-header__cta font-display text-sm tracking-wide md:text-base"

const mobileCtaBase =
  "site-header__mobile-cta font-display text-base tracking-wide"

const mobileLinkBase =
  "site-header__mobile-link font-display text-lg tracking-wide text-tant-gold/90"

const WHATSAPP_NUMBER = ""
const whatsappHref = WHATSAPP_NUMBER
  ? `https://wa.me/${WHATSAPP_NUMBER}`
  : "https://wa.me/"

const MENU_EASE = "power3.out"
const MENU_DURATION = 0.26
const MENU_STAGGER = 0.04
const MOBILE_MQ = "(max-width: 767px)"

function isMobileViewport() {
  return window.matchMedia(MOBILE_MQ).matches
}

function padYFromGlass(glassEl: HTMLElement) {
  const styles = getComputedStyle(glassEl)
  return parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom)
}

function resetDesktopGlass(
  glassEl: HTMLDivElement | null,
  items: HTMLLIElement[] = [],
) {
  if (!glassEl) return
  gsap.set(glassEl, { clearProps: "height,overflow" })
  if (items.length) gsap.set(items, { clearProps: "y,opacity" })
}

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
  const glassRef = useRef<HTMLDivElement | null>(null)
  const barRef = useRef<HTMLDivElement | null>(null)
  const itemsRef = useRef<HTMLLIElement[]>([])
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? isMobileViewport() : false,
  )

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ)
    const sync = () => setIsMobile(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  const calculateHeight = useCallback(() => {
    const glassEl = glassRef.current
    const barEl = barRef.current
    if (!glassEl || !barEl || !isMobileViewport()) return 60

    const barHeight = barEl.offsetHeight
    glassEl.style.setProperty("--mobile-nav-bar-height", `${barHeight}px`)
    const padY = padYFromGlass(glassEl)

    const contentEl = glassEl.querySelector(
      ".mobile-nav-content",
    ) as HTMLElement | null

    if (!contentEl) return barHeight + padY

    const wasVisible = contentEl.style.visibility
    const wasPointerEvents = contentEl.style.pointerEvents
    const wasPosition = contentEl.style.position
    const wasHeight = contentEl.style.height

    contentEl.style.visibility = "visible"
    contentEl.style.pointerEvents = "auto"
    contentEl.style.position = "static"
    contentEl.style.height = "auto"
    void contentEl.offsetHeight

    const contentHeight = contentEl.scrollHeight

    contentEl.style.visibility = wasVisible
    contentEl.style.pointerEvents = wasPointerEvents
    contentEl.style.position = wasPosition
    contentEl.style.height = wasHeight

    return barHeight + contentHeight + padY
  }, [])

  const getCollapsedHeight = useCallback(() => {
    const glassEl = glassRef.current
    const barEl = barRef.current
    if (!glassEl || !barEl) return 60

    glassEl.style.setProperty(
      "--mobile-nav-bar-height",
      `${barEl.offsetHeight}px`,
    )
    return barEl.offsetHeight + padYFromGlass(glassEl)
  }, [])

  const createTimeline = useCallback(() => {
    const glassEl = glassRef.current
    const barEl = barRef.current
    if (!glassEl || !barEl || !isMobileViewport()) return null

    gsap.set(itemsRef.current, { y: 16, opacity: 0 })

    const tl = gsap.timeline({ paused: true })

    tl.to(glassEl, {
      height: calculateHeight,
      duration: MENU_DURATION,
      ease: MENU_EASE,
    })

    tl.to(
      itemsRef.current,
      {
        y: 0,
        opacity: 1,
        duration: MENU_DURATION,
        ease: MENU_EASE,
        stagger: MENU_STAGGER,
      },
      "-=0.08",
    )

    return tl
  }, [calculateHeight])

  useLayoutEffect(() => {
    const glassEl = glassRef.current
    if (!glassEl) return

    if (!isMobileViewport()) {
      resetDesktopGlass(glassEl, itemsRef.current)
      return
    }

    gsap.set(glassEl, { clearProps: "height", overflow: "visible" })

    const tl = createTimeline()
    tlRef.current = tl

    return () => {
      tl?.kill()
      tlRef.current = null
    }
  }, [createTimeline])

  useLayoutEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ)

    const handleChange = () => {
      const glassEl = glassRef.current
      if (!glassEl) return

      if (!mq.matches) {
        setIsHamburgerOpen(false)
        setIsExpanded(false)
        resetDesktopGlass(glassEl, itemsRef.current)
        tlRef.current?.kill()
        tlRef.current = null
        return
      }

      if (!tlRef.current) {
        gsap.set(glassEl, { clearProps: "height", overflow: "visible" })
        tlRef.current = createTimeline()
        return
      }

      if (isExpanded) {
        gsap.set(glassEl, { height: calculateHeight() })
        tlRef.current.kill()
        const newTl = createTimeline()
        if (newTl) {
          newTl.progress(1)
          tlRef.current = newTl
        }
      } else {
        tlRef.current.kill()
        gsap.set(glassEl, { clearProps: "height", overflow: "visible" })
        tlRef.current = createTimeline()
      }
    }

    mq.addEventListener("change", handleChange)
    return () => mq.removeEventListener("change", handleChange)
  }, [isExpanded, createTimeline, calculateHeight])

  const closeMenu = useCallback(() => {
    const tl = tlRef.current
    if (!tl || !isExpanded) {
      setIsHamburgerOpen(false)
      setIsExpanded(false)
      return
    }

    setIsHamburgerOpen(false)
    tl.eventCallback("onReverseComplete", () => {
      setIsExpanded(false)
      if (glassRef.current) {
        gsap.set(glassRef.current, { clearProps: "height", overflow: "visible" })
      }
    })
    tl.reverse()
  }, [isExpanded])

  const toggleMenu = () => {
    if (!isMobileViewport()) return

    const glassEl = glassRef.current
    if (!glassEl) return

    const tl = tlRef.current ?? createTimeline()
    if (!tl) return
    tlRef.current = tl

    if (!isExpanded) {
      const collapsedHeight = getCollapsedHeight()
      gsap.set(glassEl, { height: collapsedHeight, overflow: "hidden" })
      setIsHamburgerOpen(true)
      setIsExpanded(true)
      tl.play(0)
      return
    }

    closeMenu()
  }

  useEffect(() => {
    closeMenu()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- close on route change only
  }, [location.pathname, location.hash])

  useEffect(() => {
    if (!isExpanded) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu()
    }

    document.addEventListener("keydown", onKeyDown)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [isExpanded, closeMenu])

  const setItemRef = (i: number) => (el: HTMLLIElement | null) => {
    if (el) itemsRef.current[i] = el
  }

  return (
    <header className="site-header fixed inset-x-0 top-0 z-50 px-4 pt-5 md:px-8 md:pt-6">
      <nav
        className="site-header__shell relative mx-auto max-w-6xl"
        aria-label="القائمة الرئيسية"
      >
        <div
          ref={glassRef}
          className={cn(
            "site-header__glass",
            isExpanded && isMobile && "site-header__glass--open",
          )}
        >
          <div
            ref={barRef}
            className="site-header__bar grid w-full grid-cols-[1fr_auto] items-center gap-2 md:grid-cols-[1fr_auto_1fr]"
          >
            <Link
              to="/"
              viewTransition={true}
              className="site-header__logo-link justify-self-start"
              aria-label="الصفحة الرئيسية — تنت"
              onPointerUp={blurNavLink}
              onClick={closeMenu}
            >
              <img
                src="/logo.webp"
                alt="تنت"
                className="site-header__logo h-10 w-10 object-contain md:h-11 md:w-11"
              />
            </Link>

            <ul className="hidden items-center justify-center gap-1 md:col-start-2 md:flex md:gap-1.5">
              {sectionLinks.map((link) => {
                if ("to" in link) {
                  return (
                    <li key={link.label}>
                      <NavLink
                        to={link.to}
                        viewTransition={true}
                        onPointerUp={blurNavLink}
                        className={({ isActive }) =>
                          cn(
                            linkBase,
                            isActive && "site-header__link--active",
                          )
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

            <div className="site-header__actions flex items-center justify-self-end gap-1 md:col-start-3 md:gap-1.5">

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
                        onClick={closeMenu}
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
                    <Heart
                      className="size-5 text-tant-gold"
                      strokeWidth={1.75}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="bottom">المفضلة</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                onPointerUp={blurNavLink}
                className={contactCtaBase}
              >
                تواصل معنا
                <FaWhatsapp className="site-header__cta-icon" aria-hidden />
              </a>

              <button
                type="button"
                className={cn(
                  "mobile-nav-hamburger",
                  isHamburgerOpen && "mobile-nav-hamburger--open",
                )}
                aria-expanded={isExpanded}
                aria-controls="site-mobile-menu"
                aria-label={isExpanded ? "إغلاق القائمة" : "فتح القائمة"}
                onClick={toggleMenu}
              >
                <span className="mobile-nav-hamburger-line" />
                <span className="mobile-nav-hamburger-line" />
              </button>
            </div>
          </div>

          <ul
            id="site-mobile-menu"
            className={cn(
              "mobile-nav-content",
              isExpanded
                ? "mobile-nav-content--visible"
                : "mobile-nav-content--hidden",
            )}
            aria-hidden={!isExpanded}
          >
            {sectionLinks.map((link, idx) => {
              if ("to" in link) {
                return (
                  <li key={link.label} ref={setItemRef(idx)}>
                    <NavLink
                      to={link.to}
                      viewTransition={true}
                      onPointerUp={blurNavLink}
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        cn(
                          mobileLinkBase,
                          isActive && "site-header__mobile-link--active",
                        )
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
                <li key={link.label} ref={setItemRef(idx)}>
                  <Link
                    to={href}
                    viewTransition={true}
                    onPointerUp={blurNavLink}
                    onClick={closeMenu}
                    className={cn(
                      mobileLinkBase,
                      isSectionActive && "site-header__mobile-link--active",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            })}

            <li
              ref={setItemRef(sectionLinks.length)}
              className="mobile-nav-cta-item"
            >
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                onPointerUp={blurNavLink}
                onClick={closeMenu}
                className={mobileCtaBase}
              >
                تواصل معنا
                <FaWhatsapp className="site-header__cta-icon" aria-hidden />
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  )
}
