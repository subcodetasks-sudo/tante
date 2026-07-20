import { useEffect, useMemo, useRef } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { motion, useScroll, useTransform } from "motion/react"
import { MapPin } from "lucide-react"
import { featuredItems, locations, testimonials } from "@/data/menu"
import { ScrollAnimationWrapper } from "@/components/ScrollAnimationWrapper"
import SpecularButton from "@/components/SpecularButton"
import Carousel from "@/components/Carousel"

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

export default function LandingPage() {
    const location = useLocation()
    const navigate = useNavigate()
    const heroRef = useRef<HTMLElement>(null)

    const testimonialItems = useMemo(
        () =>
            testimonials.map((t) => ({
                id: Number(t.id),
                title: t.name,
                description: `«${t.quote}»`,
                icon: t.name.charAt(0),
                rating: t.rating,
            })),
        [],
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

    return (
        <>
            {/* Hero — expands to full-bleed as it scrolls with the page */}
            <section
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
                            src="/hero-video.mp4"
                            autoPlay
                            muted
                            loop
                            playsInline
                            aria-label="المشاوي من عمائلي — طعمها غير"
                            className="absolute inset-0 size-full object-cover"
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
                                className="font-display text-sm tracking-[0.2em] text-tant-gold/80 uppercase"
                            >
                                طنط
                            </motion.p>
                            <motion.h1
                                variants={heroTextItem}
                                className="font-arabic text-5xl leading-tight text-tant-gold drop-shadow-sm md:text-6xl lg:text-7xl"
                            >
                                طعم الأصالة
                            </motion.h1>
                            <motion.p
                                variants={heroTextItem}
                                className="mx-auto max-w-md text-base leading-relaxed text-tant-cream/90 md:text-lg"
                            >
                                نكهات الشارع العربي الأصيل، بأناقة وعناية — من شاورما الفحم
                                إلى بهارات التراث المتوارثة جيلاً بعد جيل.
                            </motion.p>
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
                                    عرض القائمة
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
                                    اطلب الآن
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
                    className="scroll-mt-28 grid items-center gap-10 py-16 md:grid-cols-2 md:gap-14"
                >
                    <ScrollAnimationWrapper
                        type="fade-left"
                        className="food-placeholder order-2 aspect-square overflow-hidden rounded-3xl border border-tant-gold/25 shadow-2xl sm:aspect-[4/3] md:order-2 md:aspect-[4/3] mx-auto w-full max-w-md md:max-w-none"
                    >
                        <img src="/about-us.jpg" alt="About Us" className="w-full h-full object-cover object-center" />
                    </ScrollAnimationWrapper>

                    <div className="order-1 space-y-6 text-center md:order-1 md:text-start">
                        <ScrollAnimationWrapper type="fade-right">
                            <motion.div
                                style={{ y: molokheyaY }}
                                className="pointer-events-none flex justify-start"
                            >
                                <img
                                    src="/bowel-of-molokheya.png"
                                    alt="Bowl of Molokheya"
                                    className="h-32 w-32 rotate-6 object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)] sm:h-36 sm:w-36 md:h-44 md:w-44"
                                />
                            </motion.div>
                        </ScrollAnimationWrapper>

                        <ScrollAnimationWrapper type="fade-right" delay={0.1}>
                            <div className="space-y-4">
                                <h2 className="font-display text-3xl text-tant-gold md:text-4xl">
                                    من نحن
                                </h2>
                                <p className="font-arabic text-2xl leading-relaxed text-tant-gold-soft md:text-3xl">
                                    «من الموقد إلى المائدة، نكرّم مذاق الأصالة»
                                </p>
                                <p className="text-base leading-relaxed text-tant-cream/80 md:text-lg">
                                    وُلدت تنت من وصفات العائلة وطقوس الشارع. نختار المكوّنات
                                    المحلية، ونحترم الطرق التقليدية، ونقدّم كل طبق
                                    بدفء الضيافة العربية.
                                </p>
                            </div>
                        </ScrollAnimationWrapper>

                        <ScrollAnimationWrapper type="fade-up" delay={0.2}>
                            <motion.div
                                style={{ y: meatY }}
                                className="pointer-events-none flex justify-end"
                            >
                                <img
                                    src="/bowel-of-meat.png"
                                    alt="Bowl of Meat"
                                    className="h-36 w-36 -rotate-6 object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)] sm:h-40 sm:w-40 md:h-48 md:w-48"
                                />
                            </motion.div>
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
                            الأكثر طلبا
                        </h2>
                        <p className="mt-2 text-tant-muted">
                            لمحة ممّا تشتهر به مطبخنا.
                        </p>
                    </ScrollAnimationWrapper>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {featuredItems.map((item, index) => (
                            <ScrollAnimationWrapper
                                key={item.id}
                                type="fade-up"
                                delay={index * 0.08}
                            >
                                <article className="glass-panel overflow-hidden rounded-2xl">
                                    <div className="food-placeholder aspect-[4/3] rounded-none border-b border-tant-gold/15">
                                        <span className="text-sm tracking-wider">{item.imageLabel}</span>
                                    </div>
                                    <div className="space-y-1 p-4 text-center">
                                        <h3 className="font-display text-lg text-tant-gold">
                                            {item.name}
                                        </h3>
                                        <p className="text-sm text-tant-gold-bright">{item.price} SAR</p>
                                    </div>
                                </article>
                            </ScrollAnimationWrapper>
                        ))}
                    </div>

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
                            الفروع
                        </h2>
                        <p className="mt-2 text-tant-muted">
                            زورونا في أنحاء المملكة.
                        </p>
                    </ScrollAnimationWrapper>

                    <ul className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
                        {locations.map((loc, index) => (
                            <li key={loc.id}>
                                <ScrollAnimationWrapper
                                    type="fade-up"
                                    delay={index * 0.1}
                                    className="text-center md:text-start"
                                >
                                    <div className="mb-3 inline-flex size-10 items-center justify-center rounded-full border border-tant-gold/40 text-tant-gold">
                                        <MapPin className="size-5" />
                                    </div>
                                    <h3 className="font-display text-xl text-tant-gold">{loc.city}</h3>
                                    <p className="mt-1 text-sm text-tant-cream/80">{loc.address}</p>
                                    <p className="mt-1 text-sm text-tant-muted">{loc.hours}</p>
                                </ScrollAnimationWrapper>
                            </li>
                        ))}
                    </ul>
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

                    <ScrollAnimationWrapper type="zoom-in" className="mx-auto flex justify-center">
                        <div className="relative h-[280px] w-full max-w-xl">
                            <Carousel
                                items={testimonialItems}
                                baseWidth={576}
                                autoplay
                                autoplayDelay={5000}
                                pauseOnHover
                                loop
                                round={false}
                            />
                        </div>
                    </ScrollAnimationWrapper>
                </section>
            </div>
        </>
    )
}
