import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { motion, useMotionValue, useTransform } from "motion/react"
import type { PanInfo } from "motion/react"
import type { JSX } from "react"
import { Star } from "lucide-react"

export interface CarouselItem {
    title: string
    description: string
    id: number
    icon: React.ReactNode
    rating?: number
}

export interface CarouselProps {
    items?: CarouselItem[]
    baseWidth?: number
    autoplay?: boolean
    autoplayDelay?: number
    pauseOnHover?: boolean
    loop?: boolean
    round?: boolean
    className?: string
}

const DRAG_BUFFER = 0
const VELOCITY_THRESHOLD = 500
const GAP = 16
const SPRING_OPTIONS = { type: "spring" as const, stiffness: 300, damping: 30 }

interface CarouselItemProps {
    item: CarouselItem
    index: number
    itemWidth: number
    round: boolean
    trackItemOffset: number
    x: ReturnType<typeof useMotionValue<number>>
    transition: typeof SPRING_OPTIONS | { duration: number }
    isRtl: boolean
}

function CarouselItem({
    item,
    index,
    itemWidth,
    round,
    trackItemOffset,
    x,
    transition,
    isRtl,
}: CarouselItemProps) {
    const range = isRtl
        ? [
              (index - 1) * trackItemOffset,
              index * trackItemOffset,
              (index + 1) * trackItemOffset,
          ]
        : [
              -(index + 1) * trackItemOffset,
              -index * trackItemOffset,
              -(index - 1) * trackItemOffset,
          ]
    const outputRange = round ? (isRtl ? [-90, 0, 90] : [90, 0, -90]) : [0, 0, 0]
    const rotateY = useTransform(x, range, outputRange, { clamp: false })

    return (
        <motion.div
            key={`${item?.id ?? index}-${index}`}
            className={`relative flex shrink-0 flex-col overflow-hidden ${
                round
                    ? "cursor-grab items-center justify-center border-0 bg-tant-green-deep text-center active:cursor-grabbing"
                    : "glass-panel cursor-grab items-center justify-center rounded-2xl border border-tant-gold/20 px-6 py-8 text-center active:cursor-grabbing sm:px-8 sm:py-10"
            }`}
            style={{
                width: itemWidth,
                height: round ? itemWidth : "auto",
                minHeight: round ? undefined : 220,
                rotateY: round ? rotateY : 0,
                ...(round && { borderRadius: "50%" }),
            }}
            transition={transition}
        >
            <div className="flex flex-col items-center">
                <span className="mb-5 flex size-16 items-center justify-center rounded-full border border-tant-gold/40 bg-tant-green-deep font-display text-xl text-tant-gold">
                    {item.icon}
                </span>
                <p className="font-display text-lg leading-relaxed text-tant-cream italic md:text-xl">
                    {item.description}
                </p>
                <p className="mt-4 text-sm text-tant-gold">{item.title}</p>
                {item.rating != null && item.rating > 0 && (
                    <div className="mt-3 flex justify-center gap-1">
                        {Array.from({ length: item.rating }).map((_, i) => (
                            <Star
                                key={i}
                                className="size-4 fill-tant-gold text-tant-gold"
                            />
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    )
}

export default function Carousel({
    items = [],
    baseWidth = 300,
    autoplay = false,
    autoplayDelay = 3000,
    pauseOnHover = false,
    loop = false,
    round = false,
    className = "",
}: CarouselProps): JSX.Element {
    const containerPadding = 16
    const containerRef = useRef<HTMLDivElement>(null)
    const [containerWidth, setContainerWidth] = useState(baseWidth)

    useLayoutEffect(() => {
        const container = containerRef.current
        if (!container) return

        const updateWidth = () => {
            setContainerWidth(container.clientWidth || baseWidth)
        }

        updateWidth()
        const observer = new ResizeObserver(updateWidth)
        observer.observe(container)
        return () => observer.disconnect()
    }, [baseWidth])

    const effectiveWidth = Math.max(containerWidth, 280)
    const itemWidth = effectiveWidth - containerPadding * 2
    const trackItemOffset = itemWidth + GAP
    const itemsForRender = useMemo(() => {
        if (!loop) return items
        if (items.length === 0) return []
        return [items[items.length - 1], ...items, items[0]]
    }, [items, loop])

    const [position, setPosition] = useState<number>(loop ? 1 : 0)
    const x = useMotionValue(0)
    const [isHovered, setIsHovered] = useState<boolean>(false)
    const [isJumping, setIsJumping] = useState<boolean>(false)
    const [isAnimating, setIsAnimating] = useState<boolean>(false)
    const [isRtl, setIsRtl] = useState<boolean>(false)

    useLayoutEffect(() => {
        setIsRtl(document.documentElement.dir === "rtl")
    }, [])

    const dirMultiplier = isRtl ? 1 : -1

    useEffect(() => {
        if (pauseOnHover && containerRef.current) {
            const container = containerRef.current
            const handleMouseEnter = () => setIsHovered(true)
            const handleMouseLeave = () => setIsHovered(false)
            container.addEventListener("mouseenter", handleMouseEnter)
            container.addEventListener("mouseleave", handleMouseLeave)
            return () => {
                container.removeEventListener("mouseenter", handleMouseEnter)
                container.removeEventListener("mouseleave", handleMouseLeave)
            }
        }
    }, [pauseOnHover])

    useEffect(() => {
        if (!autoplay || itemsForRender.length <= 1) return undefined

        if (pauseOnHover && isHovered) return undefined

        const timer = setInterval(() => {
            setPosition((prev) => Math.min(prev + 1, itemsForRender.length - 1))
        }, autoplayDelay)

        return () => clearInterval(timer)
    }, [autoplay, autoplayDelay, isHovered, pauseOnHover, itemsForRender.length])

    useEffect(() => {
        const startingPosition = loop ? 1 : 0
        setPosition(startingPosition)
        x.set(dirMultiplier * startingPosition * trackItemOffset)
    }, [items.length, loop, trackItemOffset, x, dirMultiplier])

    useEffect(() => {
        if (!loop && position > itemsForRender.length - 1) {
            setPosition(Math.max(0, itemsForRender.length - 1))
        }
    }, [itemsForRender.length, loop, position])

    const effectiveTransition = isJumping ? { duration: 0 } : SPRING_OPTIONS

    const handleAnimationStart = () => {
        setIsAnimating(true)
    }

    const handleAnimationComplete = () => {
        if (!loop || itemsForRender.length <= 1) {
            setIsAnimating(false)
            return
        }
        const lastCloneIndex = itemsForRender.length - 1

        if (position === lastCloneIndex) {
            setIsJumping(true)
            const target = 1
            setPosition(target)
            x.set(dirMultiplier * target * trackItemOffset)
            requestAnimationFrame(() => {
                setIsJumping(false)
                setIsAnimating(false)
            })
            return
        }

        if (position === 0) {
            setIsJumping(true)
            const target = items.length
            setPosition(target)
            x.set(dirMultiplier * target * trackItemOffset)
            requestAnimationFrame(() => {
                setIsJumping(false)
                setIsAnimating(false)
            })
            return
        }

        setIsAnimating(false)
    }

    const handleDragEnd = (
        _: MouseEvent | TouchEvent | PointerEvent,
        info: PanInfo,
    ): void => {
        const { offset, velocity } = info
        const direction =
            offset.x < -DRAG_BUFFER || velocity.x < -VELOCITY_THRESHOLD
                ? 1
                : offset.x > DRAG_BUFFER || velocity.x > VELOCITY_THRESHOLD
                  ? -1
                  : 0

        if (direction === 0) return

        setPosition((prev) => {
            const next = prev + direction
            const max = itemsForRender.length - 1
            return Math.max(0, Math.min(next, max))
        })
    }

    const dragProps = loop
        ? {}
        : {
              dragConstraints: isRtl
                  ? {
                        left: 0,
                        right: trackItemOffset * Math.max(itemsForRender.length - 1, 0),
                    }
                  : {
                        left: -trackItemOffset * Math.max(itemsForRender.length - 1, 0),
                        right: 0,
                    },
          }

    const activeIndex =
        items.length === 0
            ? 0
            : loop
              ? (position - 1 + items.length) % items.length
              : Math.min(position, items.length - 1)

    return (
        <div
            ref={containerRef}
            className={`relative mx-auto w-full overflow-hidden p-4 ${
                round ? "rounded-full border border-tant-gold/40" : "min-h-[260px]"
            } ${className}`}
            style={{
                maxWidth: `${baseWidth}px`,
                ...(round && { height: `${baseWidth}px` }),
            }}
        >
            <motion.div
                className="flex h-full"
                drag={isAnimating ? false : "x"}
                {...dragProps}
                style={{
                    width: "max-content",
                    gap: `${GAP}px`,
                    perspective: 1000,
                    perspectiveOrigin: `${position * trackItemOffset + itemWidth / 2}px 50%`,
                    x,
                }}
                onDragEnd={handleDragEnd}
                animate={{ x: dirMultiplier * position * trackItemOffset }}
                transition={effectiveTransition}
                onAnimationStart={handleAnimationStart}
                onAnimationComplete={handleAnimationComplete}
            >
                {itemsForRender.map((item, index) => (
                    <CarouselItem
                        key={`${item?.id ?? index}-${index}`}
                        item={item}
                        index={index}
                        itemWidth={itemWidth}
                        round={round}
                        trackItemOffset={trackItemOffset}
                        x={x}
                        transition={effectiveTransition}
                        isRtl={isRtl}
                    />
                ))}
            </motion.div>
            <div
                className={`flex w-full justify-center ${round ? "absolute bottom-12 left-1/2 z-20 -translate-x-1/2" : ""}`}
            >
                <div className="mt-4 flex justify-center gap-2">
                    {items.map((_, index) => (
                        <motion.button
                            type="button"
                            key={index}
                            aria-label={`عرض الرأي ${index + 1}`}
                            aria-current={activeIndex === index}
                            className={`size-2.5 cursor-pointer appearance-none rounded-full border-0 p-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tant-gold ${
                                activeIndex === index
                                    ? "bg-tant-gold"
                                    : "bg-tant-gold/30 hover:bg-tant-gold/50"
                            }`}
                            animate={{
                                scale: activeIndex === index ? 1.2 : 1,
                            }}
                            onClick={() => setPosition(loop ? index + 1 : index)}
                            transition={{ duration: 0.15 }}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
