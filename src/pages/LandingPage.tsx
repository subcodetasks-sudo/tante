import { useEffect, useRef, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react"
import { MapPin, Star } from "lucide-react"
import { featuredItems, locations, testimonials } from "@/data/menu"
import { ScrollAnimationWrapper } from "@/components/ScrollAnimationWrapper"

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
    const heroRef = useRef<HTMLElement>(null)
    const [feedbackIndex, setFeedbackIndex] = useState(0)
    const feedback = testimonials[feedbackIndex]

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
    const borderRadius = useTransform(expand, [0, 1], [16, 0])

    return (
        <>
            {/* Hero — expands to full-bleed as it scrolls with the page */}
            <section
                ref={heroRef}
                className="relative -mt-20 h-[100dvh] md:-mt-[5.5rem]"
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
                                <Link
                                    to="/menu"
                                    viewTransition={true}
                                    className="btn-gold inline-flex rounded-xl px-6 py-2.5 text-sm md:text-base"
                                >
                                    عرض القائمة
                                </Link>
                                <Link
                                    to="/menu"
                                    viewTransition={true}
                                    className="btn-gold-outline inline-flex rounded-xl px-6 py-2.5 text-sm md:text-base"
                                >
                                    اطلب الآن
                                </Link>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </section>

            <div className="mx-auto max-w-6xl overflow-x-clip px-4 pb-16 md:px-8">
                {/* About Us */}
                <section
                    id="about"
                    className="scroll-mt-28 grid items-center gap-10 overflow-x-clip py-16 md:grid-cols-2 md:gap-14"
                >
                    <ScrollAnimationWrapper
                        type="fade-left"
                        className="food-placeholder aspect-[16/10] overflow-hidden rounded-2xl border border-tant-gold/20 md:order-2"
                    >
                        <span className="font-display text-xl tracking-wide">بهارات وتراث</span>
                    </ScrollAnimationWrapper>
                    <ScrollAnimationWrapper
                        type="fade-right"
                        delay={0.1}
                        className="space-y-4 text-center md:order-1 md:text-start"
                    >
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
                    </ScrollAnimationWrapper>
                </section>

                {/* Featured Menu */}
                <section
                    id="menu"
                    className="scroll-mt-28 space-y-8 py-16"
                >
                    <ScrollAnimationWrapper type="blur-fade" className="text-center">
                        <h2 className="font-display text-3xl text-tant-gold md:text-4xl">
                            مختاراتنا
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

                    <ScrollAnimationWrapper type="zoom-in" className="mx-auto max-w-xl">
                        <AnimatePresence mode="wait">
                            <motion.blockquote
                                key={feedback.id}
                                initial={{ opacity: 0, x: -24 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 24 }}
                                transition={{ duration: 0.35 }}
                                className="glass-panel rounded-2xl px-8 py-10 text-center"
                            >
                                <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full border border-tant-gold/40 bg-tant-green-deep font-display text-xl text-tant-gold">
                                    {feedback.name.charAt(0)}
                                </div>
                                <p className="font-display text-lg leading-relaxed text-tant-cream italic md:text-xl">
                                    «{feedback.quote}»
                                </p>
                                <p className="mt-4 text-sm text-tant-gold">{feedback.name}</p>
                                <div className="mt-3 flex justify-center gap-1">
                                    {Array.from({ length: feedback.rating }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className="size-4 fill-tant-gold text-tant-gold"
                                        />
                                    ))}
                                </div>
                            </motion.blockquote>
                        </AnimatePresence>

                        <div className="mt-6 flex justify-center gap-2">
                            {testimonials.map((t, i) => (
                                <button
                                    key={t.id}
                                    type="button"
                                    aria-label={`عرض الرأي ${i + 1}`}
                                    onClick={() => setFeedbackIndex(i)}
                                    className={`size-2.5 rounded-full transition-colors ${i === feedbackIndex
                                        ? "bg-tant-gold"
                                        : "bg-tant-gold/30 hover:bg-tant-gold/50"
                                        }`}
                                />
                            ))}
                        </div>
                    </ScrollAnimationWrapper>
                </section>
            </div>
        </>
    )
}
