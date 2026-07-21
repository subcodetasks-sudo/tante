import { useEffect, useMemo, useRef } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react"
import { MapPin } from "lucide-react"
import { ElfsightGoogleReviews } from "@/components/ElfsightGoogleReviews"
import { ScrollAnimationWrapper } from "@/components/ScrollAnimationWrapper"
import SpecularButton from "@/components/SpecularButton"
import { Marquee } from "@/components/ui/marquee"
import { TestimonialCard, TestimonialCardSkeleton } from "@/components/TestimonialCard"
import { MenuItemCard, MenuItemCardSkeleton } from "@/components/MenuItemCard"
import { useMenuStore } from "@/store/menuStore"
import { useSiteStore } from "@/store/siteStore"

const heroEase = [0.22, 1, 0.36, 1] as const

const heroTextContainer = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.2,
        },
    },
}

const heroTextItem = {
    hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            duration: 0.85,
            ease: heroEase,
        },
    },
}

function formatBranchHours(openFrom: string, openTo: string) {
    return `يومياً ${openFrom} – ${openTo}`
}

export default function LandingPage() {
    const location = useLocation()
    const navigate = useNavigate()
    const heroRef = useRef<HTMLElement>(null)

    const mostOrdered = useMenuStore((s) => s.mostOrdered)
    const mostOrderedStatus = useMenuStore((s) => s.mostOrderedStatus)
    const fetchMostOrdered = useMenuStore((s) => s.fetchMostOrdered)
    const settings = useSiteStore((s) => s.settings)
    const hero = useSiteStore((s) => s.hero)
    const about = useSiteStore((s) => s.about)
    const branchContent = useSiteStore((s) => s.branchContent)
    const branches = useSiteStore((s) => s.branches)
    const testimonials = useSiteStore((s) => s.testimonials)
    const siteStatus = useSiteStore((s) => s.status)
    const fetchSite = useSiteStore((s) => s.fetchAll)

    useEffect(() => {
        void fetchMostOrdered()
        void fetchSite()
    }, [fetchMostOrdered, fetchSite])

    const featuredItems = useMemo(
        () =>
            (mostOrdered?.products ?? []).map((product) => ({
                product,
                categoryName: product.category?.name_ar ?? "",
                categoryId: product.category?.id ?? product.category_id,
            })),
        [mostOrdered],
    )

    const testimonialItems = useMemo(
        () => testimonials.filter((item) => Boolean(item.video)),
        [testimonials],
    )

    useEffect(() => {
        if (!location.hash) return
        const id = location.hash.slice(1)
        const el = document.getElementById(id)
        if (el) {
            requestAnimationFrame(() => {
                el.scrollIntoView({ behavior: "smooth", block: "start" })
            })
        }
    }, [location.hash])

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"],
    })

    const expand = useTransform(scrollYProgress, [0, 0.5], [0, 1], {
        clamp: true,
    })
    const insetX = useTransform(expand, [0, 1], [8, 0])
    const insetY = useTransform(expand, [0, 1], [8, 0])
    const borderRadius = useTransform(expand, [0, 1], [26, 0])

    const aboutRef = useRef<HTMLElement>(null)
    const { scrollYProgress: aboutScrollY } = useScroll({
        target: aboutRef,
        offset: ["start end", "end start"],
    })

    const meatY = useTransform(aboutScrollY, [0, 1], [-15, 35])
    const molokheyaY = useTransform(aboutScrollY, [0, 1], [25, -25])
    const mahsheY = useTransform(aboutScrollY, [0, 1], [10, -20])

    return (
        <>
            <title>
                {settings?.restaurant_name ?? "طنط"}
                {hero?.title ? ` — ${hero.title}` : " — طعم الأصالة"}
            </title>
            {/* Hero — expands to full-bleed as it scrolls with the page */}
            <section
                id="home"
                ref={heroRef}
                className="relative -mt-[5.25rem] h-[100dvh] md:-mt-[6rem]"
            >
                <motion.div
                    style={{
                        paddingTop: insetY,
                        paddingLeft: insetX,
                        paddingRight: insetX,
                        paddingBottom: insetY,
                    }}
                    className="h-full"
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.65, ease: "easeOut" }}
                        style={{ borderRadius }}
                        className="relative flex h-full w-full items-center justify-center overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
                    >
                        <video
                            src={hero?.video ?? "/hero-video.mp4"}
                            autoPlay
                            muted
                            loop
                            playsInline
                            aria-label={hero?.title ?? "طعم الأصالة"}
                            className="absolute inset-0 size-full object-cover"
                            preload="auto"
                        />
                        <div
                            className="absolute inset-0 bg-gradient-to-t from-tant-green-deep/85 via-tant-green-deep/45 to-tant-green-deep/25"
                            aria-hidden
                        />

                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={heroTextContainer}
                            className="relative z-10 flex max-w-2xl flex-col items-center space-y-6 px-6 py-10 text-center sm:px-10"
                        >
                            <motion.p
                                variants={heroTextItem}
                                className="font-display text-5xl tracking-[0.15em] text-tant-gold/80 uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] md:text-6xl lg:text-7xl"
                            >
                                {settings?.restaurant_name ?? "طنط"}
                            </motion.p>
                            <motion.h1
                                variants={heroTextItem}
                                className="font-arabic text-2xl leading-tight text-tant-gold drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] md:text-3xl lg:text-4xl"
                            >
                                {hero?.title ?? "طعم الأصالة"}
                            </motion.h1>
                            <motion.p
                                variants={heroTextItem}
                                className="mx-auto max-w-md text-base leading-relaxed text-tant-cream/90 drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)] md:text-lg"
                            >
                                {hero?.description ??
                                    "نكهات الشارع العربي الأصيل، بأناقة وعناية — من شاورما الفحم إلى بهارات التراث المتوارثة جيلاً بعد جيل."}
                            </motion.p>
                            {hero?.content ? (
                                <motion.p
                                    variants={heroTextItem}
                                    className="mx-auto max-w-lg text-sm leading-relaxed text-tant-cream/75 drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)] md:text-base"
                                >
                                    {hero.content}
                                </motion.p>
                            ) : null}
                            <motion.div
                                variants={heroTextItem}
                                className="mt-4 flex flex-wrap items-center justify-center gap-3"
                            >
                                <SpecularButton
                                    size="md"
                                    radius={18}
                                    tint="#e0b45c"
                                    tintOpacity={0.92}
                                    blur={0}
                                    textColor="#2e472a"
                                    lineColor="#f0c870"
                                    baseColor="#c9a04a"
                                    intensity={1.15}
                                    shineSize={12}
                                    shineFade={36}
                                    thickness={1.2}
                                    speed={0.35}
                                    followMouse
                                    proximity={250}
                                    autoAnimate={false}
                                    onClick={() => navigate("/menu", { viewTransition: true })}
                                    className="font-sans text-sm md:text-base"
                                >
                                    {hero?.button_1_name ?? "عرض القائمة"}
                                </SpecularButton>
                                <SpecularButton
                                    size="md"
                                    radius={18}
                                    tint="#e0b45c"
                                    tintOpacity={0}
                                    blur={0}
                                    textColor="#e0b45c"
                                    lineColor="#f8c870"
                                    baseColor="#e0b45c"
                                    intensity={1}
                                    shineSize={12}
                                    shineFade={36}
                                    thickness={1.2}
                                    speed={0.35}
                                    followMouse
                                    proximity={250}
                                    autoAnimate={false}
                                    onClick={() => navigate("/menu", { viewTransition: true })}
                                    className="font-sans text-sm shadow-none md:text-base"
                                >
                                    {hero?.button_2_name ?? "اطلب الآن"}
                                </SpecularButton>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </section>

            <div className="mx-auto max-w-6xl px-4 pb-16 md:px-8">
                {/* About Us */}
                <section
                    ref={aboutRef}
                    id="about"
                    className="scroll-mt-28 grid items-center gap-10 pt-24 pb-16 md:grid-cols-2 md:gap-14 md:pt-32"
                >
                    <ScrollAnimationWrapper
                        typeMd="fade-left"
                        className="food-placeholder order-2 aspect-square overflow-hidden rounded-3xl border border-tant-gold/25 shadow-2xl sm:aspect-[4/3] md:order-2 md:aspect-[4/3] mx-auto w-full max-w-md md:max-w-none"
                    >
                        <img
                            src={about?.image ?? "/about-us.jpg"}
                            alt={about?.title ?? "من نحن"}
                            className="w-full h-full object-cover object-center"
                        />
                    </ScrollAnimationWrapper>

                    <div className="order-1 space-y-6 text-center md:order-1 md:text-start">
                        <ScrollAnimationWrapper typeMd="fade-right">
                            <div className="space-y-4">
                                <h2 className="font-display text-3xl text-tant-gold md:text-4xl">
                                    {about?.title ?? "من نحن"}
                                </h2>
                                <p className="font-arabic text-2xl leading-relaxed text-tant-gold-soft md:text-3xl">
                                    {about?.description ?? "من الموقد إلى المائدة، نكرّم مذاق الأصالة"}
                                </p>
                                <p className="whitespace-pre-line text-base leading-relaxed text-tant-cream/80 md:text-lg">
                                    {about?.content ??
                                        "وُلدت تنت من وصفات العائلة وطقوس الشارع. نختار المكوّنات المحلية، ونحترم الطرق التقليدية، ونقدّم كل طبق بدفء الضيافة العربية."}
                                </p>
                            </div>
                        </ScrollAnimationWrapper>

                        <ScrollAnimationWrapper delay={0.2}>
                            <div className="pointer-events-none flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:flex-nowrap md:justify-start md:gap-3">
                                <motion.img
                                    style={{ y: molokheyaY }}
                                    src="/bowel-of-molokheya.png"
                                    alt="Bowl of Molokheya"
                                    className="h-28 w-28 shrink-0 rotate-6 object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)] sm:h-32 sm:w-32 md:h-36 md:w-36"
                                    fetchPriority="high"
                                    loading="eager"
                                    draggable={false}
                                />
                                <motion.img
                                    style={{ y: meatY }}
                                    src="/bowel-of-meat.png"
                                    alt="Bowl of Meat"
                                    className="h-32 w-32 shrink-0 -rotate-6 object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)] sm:h-36 sm:w-36 md:h-40 md:w-40"
                                    fetchPriority="high"
                                    loading="eager"
                                    draggable={false}
                                />
                                <motion.img
                                    style={{ y: mahsheY }}
                                    src="/bowel-of-mahshe.png"
                                    alt="Bowl of Mahshe"
                                    className="h-28 w-28 shrink-0 rotate-3 object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)] sm:h-32 sm:w-32 md:h-36 md:w-36"
                                    fetchPriority="high"
                                    loading="eager"
                                    draggable={false}
                                />
                            </div>
                        </ScrollAnimationWrapper>
                    </div>
                </section>

                {/* Featured Menu */}
                <section
                    id="menu"
                    className="scroll-mt-28 space-y-8 py-16"
                >
                    <ScrollAnimationWrapper type="blur-fade" className="text-center">
                        <h2 className="font-display text-3xl text-tant-gold md:text-4xl">
                            {mostOrdered?.title ?? "الأكثر طلباً"}
                        </h2>
                        <p className="mt-2 text-tant-muted">
                            {mostOrdered?.description ??
                                "لمحة ممّا تشتهر به مطبخنا."}
                        </p>
                    </ScrollAnimationWrapper>

                    <AnimatePresence mode="wait">
                        {mostOrderedStatus === "loading" ? (
                            <motion.div
                                key="skeleton"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
                            >
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <MenuItemCardSkeleton key={index} />
                                ))}
                            </motion.div>
                        ) : featuredItems.length > 0 ? (
                            <motion.div
                                key="content"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
                            >
                                {featuredItems.map(({ product, categoryName, categoryId }, index) => (
                                    <ScrollAnimationWrapper
                                        key={product.id}
                                        type="fade-up"
                                        delay={index * 0.08}
                                    >
                                        <MenuItemCard
                                            item={product}
                                            categoryId={categoryId}
                                            categoryName={categoryName}
                                        />
                                    </ScrollAnimationWrapper>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.p
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="text-center text-tant-muted"
                            >
                                لا توجد أطباق مميزة حالياً.
                            </motion.p>
                        )}
                    </AnimatePresence>

                    <ScrollAnimationWrapper type="zoom-in" delay={0.15} className="flex justify-center pt-2">
                        <Link
                            to="/menu"
                            viewTransition={true}
                            className="btn-gold rounded-xl px-8 py-2.5 text-sm md:text-base"
                        >
                            عرض القائمة كاملة
                        </Link>
                    </ScrollAnimationWrapper>
                </section>

                {/* Locations */}
                <section
                    id="locations"
                    className="scroll-mt-28 space-y-8 py-16"
                >
                    <ScrollAnimationWrapper type="blur-fade" className="text-center">
                        <h2 className="font-display text-3xl text-tant-gold md:text-4xl">
                            {branchContent?.title ?? "الفروع"}
                        </h2>
                        <p className="mt-2 text-tant-muted">
                            {branchContent?.description ??
                                "زورونا في أنحاء المملكة."}
                        </p>
                    </ScrollAnimationWrapper>

                    <ul className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
                        {branches.map((branch, index) => (
                            <li key={branch.id}>
                                <ScrollAnimationWrapper
                                    type="fade-up"
                                    delay={index * 0.1}
                                    className="text-center md:text-start"
                                >
                                    <div className="mb-3 inline-flex size-10 items-center justify-center rounded-full border border-tant-gold/40 text-tant-gold">
                                        <MapPin className="size-5" />
                                    </div>
                                    <h3 className="font-display text-xl text-tant-gold">
                                        {branch.name}
                                    </h3>
                                    <p className="mt-1 text-sm text-tant-cream/80">
                                        {branch.address}
                                    </p>
                                    <p className="mt-1 text-sm text-tant-muted">
                                        {formatBranchHours(
                                            branch.open_from,
                                            branch.open_to,
                                        )}
                                    </p>
                                </ScrollAnimationWrapper>
                            </li>
                        ))}
                    </ul>

                    <ScrollAnimationWrapper
                        type="fade-up"
                        className="mx-auto max-w-4xl overflow-hidden rounded-xl border border-tant-gold/40 shadow-[0_0_0_4px_color-mix(in_srgb,var(--tant-gold)_12%,transparent)]"
                    >
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3710.880381373771!2d39.15991049999999!3d21.5515321!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15c3d190c1f4f1c7%3A0xeeda0c42385dd571!2z2YXYt9i52YUg2LfZhti3INis2K_YqQ!5e0!3m2!1sen!2seg!4v1784640563961!5m2!1sen!2seg"
                            title="موقع الفرع على الخريطة"
                            width="600"
                            height="450"
                            className="h-[450px] w-full border-0"
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="strict-origin-when-cross-origin"
                        />
                    </ScrollAnimationWrapper>

                    <ElfsightGoogleReviews />
                </section>

                {/* Customers Feedback */}
                <section
                    id="feedback"
                    className="scroll-mt-28 space-y-8 py-16"
                >
                    <ScrollAnimationWrapper type="blur-fade" className="text-center">
                        <h2 className="font-display text-3xl text-tant-gold md:text-4xl">
                            آراء العملاء
                        </h2>
                    </ScrollAnimationWrapper>

                    <ScrollAnimationWrapper type="zoom-in" className="w-full">
                        <AnimatePresence mode="wait">
                            {siteStatus === "loading" && testimonialItems.length === 0 ? (
                                <motion.div
                                    key="skeleton"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex justify-center gap-4 overflow-hidden py-8"
                                >
                                    {Array.from({ length: 3 }).map((_, index) => (
                                        <TestimonialCardSkeleton key={index} className="w-[250px] sm:w-[280px] md:w-[320px] max-w-[80vw] shrink-0" />
                                    ))}
                                </motion.div>
                            ) : testimonialItems.length > 0 ? (
                                <motion.div
                                    key="content"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="relative w-full py-8 overflow-hidden rounded-3xl"
                                >
                                    <Marquee pauseOnHover repeat={12} className="py-6 [--duration:35s] [--gap:1rem] sm:[--gap:1.5rem] rounded-3xl overflow-hidden">
                                        {testimonialItems.map((item) => (
                                            <TestimonialCard
                                                key={item.id}
                                                testimonial={item}
                                                className="w-[250px] sm:w-[280px] md:w-[320px] max-w-[80vw] shrink-0"
                                            />
                                        ))}
                                    </Marquee>
                                </motion.div>
                            ) : (
                                <motion.p
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-center text-tant-muted"
                                >
                                    لا توجد آراء للعملاء حالياً.
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </ScrollAnimationWrapper>
                </section>
            </div>
        </>
    )
}
