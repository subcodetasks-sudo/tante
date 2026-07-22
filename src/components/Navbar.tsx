import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"
import { FaWhatsapp } from "react-icons/fa"
import { gsap } from "gsap"
import { AnimatePresence, motion } from "motion/react"
import { Heart, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useMenuStore } from "@/store/menuStore"
import { useSiteStore } from "@/store/siteStore"
import { SiteLogo } from "@/components/SiteLogo"
import type { Product } from "@/types/api"

type SearchHit = {
  product: Product
  categoryId: number
  categoryName: string
}

function normalizeSearch(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ")
}

function productMatchesQuery(product: Product, query: string) {
  if (!query) return false
  const nameAr = normalizeSearch(product.name_ar ?? "")
  const nameEn = normalizeSearch(product.name_en ?? "")
  return nameAr.includes(query) || nameEn.includes(query)
}

function productPriceLabel(product: Product) {
  if (product.price != null) return `${product.price} ر.س`
  const priced = (product.weights ?? []).find((w) => w.price != null)
  return priced ? `${priced.price} ر.س` : null
}

const sectionLinks = [
  { label: "الرئيسية", hash: "home" },
  { label: "من نحن", hash: "about" },
  { label: "القائمة", to: "/menu" as const },
  { label: "المعرض", to: "/gallery" as const },
  { label: "الفروع", hash: "locations" },
  { label: "آراء العملاء", hash: "feedback" },
] as const

type SectionLink = (typeof sectionLinks)[number]
type HashSectionLink = Extract<SectionLink, { hash: string }>

function sectionHref(hash: string) {
  return `/#${hash}`
}

const linkBase =
  "site-header__link font-display text-sm tracking-wide nav:text-base"

const contactCtaBase =
  "site-header__cta font-display text-sm tracking-wide nav:text-base"

const mobileCtaBase =
  "site-header__mobile-cta font-display text-base tracking-wide"

const mobileLinkBase =
  "site-header__mobile-link font-display text-lg tracking-wide text-tant-gold/90"

const MENU_EASE = "power3.out"
const MENU_DURATION = 0.26
const MENU_STAGGER = 0.04
const MOBILE_MQ = "(max-width: 881px)"

function whatsappHrefFromSettings(whatsapp: string | null | undefined) {
  if (!whatsapp) return "https://wa.me/"
  const digits = whatsapp.replace(/\D/g, "")
  return digits ? `https://wa.me/${digits}` : whatsapp
}

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

function getMenuItems(menu: HTMLUListElement | null) {
  if (!menu) return [] as HTMLLIElement[]
  return Array.from(menu.children) as HTMLLIElement[]
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
  const navigate = useNavigate()
  const onHome = location.pathname === "/"
  const settings = useSiteStore((s) => s.settings)
  const whatsappHref = whatsappHrefFromSettings(settings?.social.whatsapp)
  const categories = useMenuStore((s) => s.categories)
  const menuStatus = useMenuStore((s) => s.status)
  const fetchMenu = useMenuStore((s) => s.fetchMenu)
  const glassRef = useRef<HTMLDivElement | null>(null)
  const barRef = useRef<HTMLDivElement | null>(null)
  const shellRef = useRef<HTMLElement | null>(null)
  const mobileMenuRef = useRef<HTMLUListElement | null>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const searchPanelRef = useRef<HTMLDivElement | null>(null)
  const searchInputRef = useRef<HTMLInputElement | null>(null)
  const searchToggleRef = useRef<HTMLSpanElement | null>(null)

  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeSection, setActiveSection] = useState<string>("home")
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? isMobileViewport() : false,
  )

  useEffect(() => {
    if (!onHome) return

    const sectionIds = sectionLinks
      .filter((link): link is HashSectionLink => "hash" in link)
      .map((link) => link.hash)

    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    }

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }

    const observer = new IntersectionObserver(handleIntersect, observerOptions)
    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => {
      observer.disconnect()
    }
  }, [onHome])

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

    const items = getMenuItems(mobileMenuRef.current)
    gsap.set(items, { y: 16, opacity: 0 })

    const tl = gsap.timeline({ paused: true })

    tl.to(glassEl, {
      height: calculateHeight,
      duration: MENU_DURATION,
      ease: MENU_EASE,
    })

    tl.to(
      items,
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
      resetDesktopGlass(glassEl, getMenuItems(mobileMenuRef.current))
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
        resetDesktopGlass(glassEl, getMenuItems(mobileMenuRef.current))
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

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false)
  }, [])

  const openSearch = useCallback(() => {
    closeMenu()
    setSearchQuery("")
    setIsSearchOpen(true)
    void fetchMenu()
  }, [closeMenu, fetchMenu])

  const toggleSearch = () => {
    if (isSearchOpen) {
      closeSearch()
      return
    }
    openSearch()
  }

  const toggleMenu = () => {
    if (!isMobileViewport()) return

    const glassEl = glassRef.current
    if (!glassEl) return

    if (isSearchOpen) closeSearch()

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

  const normalizedQuery = normalizeSearch(searchQuery)

  const searchHits = useMemo((): SearchHit[] => {
    if (!normalizedQuery) return []

    const hits: SearchHit[] = []
    for (const category of categories) {
      for (const product of category.products ?? []) {
        if (!productMatchesQuery(product, normalizedQuery)) continue
        hits.push({
          product,
          categoryId: category.id,
          categoryName: category.name_ar,
        })
        if (hits.length >= 8) return hits
      }
    }
    return hits
  }, [categories, normalizedQuery])

  const selectSearchHit = useCallback(
    (hit: SearchHit) => {
      closeSearch()
      closeMenu()
      navigate(
        `/menu?category=${hit.categoryId}&product=${hit.product.id}`,
        { viewTransition: true },
      )
    },
    [closeMenu, closeSearch, navigate],
  )

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      closeMenu()
      closeSearch()
    })
    return () => window.cancelAnimationFrame(frame)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- close on route change only
  }, [location.pathname, location.hash])

  useEffect(() => {
    if (!isSearchOpen) return
    const frame = window.requestAnimationFrame(() => {
      searchInputRef.current?.focus()
    })
    return () => window.cancelAnimationFrame(frame)
  }, [isSearchOpen])

  useLayoutEffect(() => {
    const shell = shellRef.current
    const header = shell?.closest(".site-header") as HTMLElement | null
    if (!header || !shell) return

    const syncSearchTop = () => {
      const shellBottom = shell.getBoundingClientRect().bottom
      header.style.setProperty(
        "--site-search-top",
        `${Math.max(shellBottom + 8, 0)}px`,
      )
    }

    syncSearchTop()
    window.addEventListener("resize", syncSearchTop)
    return () => window.removeEventListener("resize", syncSearchTop)
  }, [isSearchOpen, isExpanded])

  useEffect(() => {
    if (!isSearchOpen) return

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node
      if (searchPanelRef.current?.contains(target)) return
      if (searchToggleRef.current?.contains(target)) return
      closeSearch()
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSearch()
    }

    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [isSearchOpen, closeSearch])

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

  return (
    <header className="site-header fixed inset-x-0 top-0 z-50 px-4 pt-5 nav:px-8 nav:pt-6">
      <nav
        ref={shellRef}
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
            className="site-header__bar grid w-full grid-cols-[1fr_auto] items-center gap-2 nav:grid-cols-[1fr_auto_1fr]"
          >
            <Link
              to="/"
              viewTransition={true}
              className="site-header__logo-link justify-self-start"
              aria-label="الصفحة الرئيسية — تنت"
              onPointerUp={blurNavLink}
              onClick={closeMenu}
            >
              <SiteLogo
                src={settings?.logo}
                alt={settings?.restaurant_name ?? "تنت"}
                className="site-header__logo h-10 w-10 object-contain nav:h-11 nav:w-11"
              />
            </Link>

            <ul className="hidden items-center justify-center gap-1 nav:col-start-2 nav:flex nav:gap-1.5">
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
                  onHome && activeSection === link.hash

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

            <div className="site-header__actions flex items-center justify-self-end gap-1 nav:col-start-3 nav:gap-1.5">
              <span ref={searchToggleRef} className="inline-flex">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger
                      delay={300}
                      render={(props) => (
                        <button
                          {...props}
                          type="button"
                          onClick={(event) => {
                            props.onClick?.(event)
                            toggleSearch()
                          }}
                          aria-label={
                            isSearchOpen ? "إغلاق البحث" : "بحث في القائمة"
                          }
                          aria-expanded={isSearchOpen}
                          aria-controls="site-menu-search"
                          className={cn(
                            props.className,
                            "site-header__fav inline-flex size-10 shrink-0 items-center justify-center nav:size-11",
                            isSearchOpen && "site-header__fav--active",
                          )}
                        />
                      )}
                    >
                      {isSearchOpen ? (
                        <X
                          className="size-5 text-tant-gold"
                          strokeWidth={1.75}
                        />
                      ) : (
                        <Search
                          className="size-5 text-tant-gold"
                          strokeWidth={1.75}
                        />
                      )}
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      {isSearchOpen ? "إغلاق البحث" : "بحث"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </span>

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
                            "site-header__fav inline-flex size-10 shrink-0 items-center justify-center nav:size-11",
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
            ref={mobileMenuRef}
            id="site-mobile-menu"
            className={cn(
              "mobile-nav-content",
              isExpanded
                ? "mobile-nav-content--visible"
                : "mobile-nav-content--hidden",
            )}
            aria-hidden={!isExpanded}
          >
            {sectionLinks.map((link) => {
              if ("to" in link) {
                return (
                  <li key={link.label}>
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
                onHome && activeSection === link.hash

              return (
                <li key={link.label}>
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

            <li className="mobile-nav-cta-item">
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

        <AnimatePresence
          onExitComplete={() => {
            setSearchQuery("")
          }}
        >
          {isSearchOpen ? (
            <motion.div
              ref={searchPanelRef}
              id="site-menu-search"
              className="site-header__search"
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              aria-hidden={false}
            >
              <label className="site-header__search-field">
                <Search
                  className="site-header__search-icon size-4 shrink-0"
                  strokeWidth={1.75}
                  aria-hidden
                />
                <input
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن منتج في القائمة..."
                  autoComplete="off"
                  enterKeyHint="search"
                  aria-label="ابحث عن منتج في القائمة"
                  className="site-header__search-input"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    className="site-header__search-clear"
                    aria-label="مسح البحث"
                    onClick={() => {
                      setSearchQuery("")
                      searchInputRef.current?.focus()
                    }}
                  >
                    <X className="size-4" strokeWidth={1.75} aria-hidden />
                  </button>
                ) : null}
              </label>

              {normalizedQuery ? (
                <div className="site-header__search-results" role="listbox">
                  {menuStatus === "loading" && categories.length === 0 ? (
                    <p className="site-header__search-empty">
                      جاري تحميل القائمة...
                    </p>
                  ) : searchHits.length > 0 ? (
                    <ul className="site-header__search-list">
                      {searchHits.map((hit) => {
                        const price = productPriceLabel(hit.product)
                        return (
                          <li key={hit.product.id}>
                            <button
                              type="button"
                              role="option"
                              className="site-header__search-hit"
                              onClick={() => selectSearchHit(hit)}
                            >
                              <span className="site-header__search-hit-copy">
                                <span className="site-header__search-hit-name">
                                  {hit.product.name_ar}
                                </span>
                                <span className="site-header__search-hit-meta">
                                  {hit.categoryName}
                                </span>
                              </span>
                              {price ? (
                                <span className="site-header__search-hit-price">
                                  {price}
                                </span>
                              ) : null}
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  ) : (
                    <p className="site-header__search-empty">
                      لا توجد نتائج لـ «{searchQuery.trim()}»
                    </p>
                  )}
                </div>
              ) : null}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </nav>
    </header>
  )
}
