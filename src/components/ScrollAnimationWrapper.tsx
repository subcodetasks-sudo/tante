import { motion, useInView } from "motion/react"
import { type ReactNode, useRef, useState, useEffect } from "react"

export type AnimationType =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "zoom-in"
  | "zoom-out"
  | "blur-fade"

const MD_MQ = "(min-width: 768px)"

interface ScrollAnimationWrapperProps {
  children: ReactNode
  className?: string
  type?: AnimationType
  /** Animation used from the `md` breakpoint up; below that, `type` (default fade-up) is used. */
  typeMd?: AnimationType
  delay?: number
  duration?: number
  threshold?: number
  once?: boolean
}

export function ScrollAnimationWrapper({
  children,
  className = "",
  type = "fade-up",
  typeMd,
  delay = 0,
  duration = 0.6,
  threshold = 0.15,
  once = false,
}: ScrollAnimationWrapperProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount: threshold })
  const [hasEntered, setHasEntered] = useState(false)
  const [isRtl, setIsRtl] = useState(false)
  const [isMdUp, setIsMdUp] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(MD_MQ).matches : false,
  )

  useEffect(() => {
    setIsRtl(document.documentElement.dir === "rtl")
  }, [])

  useEffect(() => {
    if (!typeMd) return
    const mq = window.matchMedia(MD_MQ)
    const update = () => setIsMdUp(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [typeMd])

  useEffect(() => {
    if (isInView) {
      setHasEntered(true)
    }
  }, [isInView])

  const animateState = isInView ? "visible" : hasEntered ? "exit" : "hidden"
  const activeType = typeMd && isMdUp ? typeMd : type

  const getVariants = () => {
    const commonTransition = {
      duration,
      ease: [0.25, 1, 0.5, 1] as const,
      delay,
    }

    const xFactor = isRtl ? -1 : 1

    switch (activeType) {
      case "fade-up":
        return {
          hidden: {
            opacity: 0,
            y: 50,
            scale: 0.98,
            transition: commonTransition,
          },
          visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: commonTransition,
          },
          exit: {
            opacity: 0,
            y: -50,
            scale: 0.98,
            transition: commonTransition,
          },
        }
      case "fade-down":
        return {
          hidden: {
            opacity: 0,
            y: -50,
            scale: 0.98,
            transition: commonTransition,
          },
          visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: commonTransition,
          },
          exit: {
            opacity: 0,
            y: 50,
            scale: 0.98,
            transition: commonTransition,
          },
        }
      case "fade-left":
        return {
          hidden: {
            opacity: 0,
            x: 50 * xFactor,
            transition: commonTransition,
          },
          visible: {
            opacity: 1,
            x: 0,
            transition: commonTransition,
          },
          exit: {
            opacity: 0,
            x: -50 * xFactor,
            transition: commonTransition,
          },
        }
      case "fade-right":
        return {
          hidden: {
            opacity: 0,
            x: -50 * xFactor,
            transition: commonTransition,
          },
          visible: {
            opacity: 1,
            x: 0,
            transition: commonTransition,
          },
          exit: {
            opacity: 0,
            x: 50 * xFactor,
            transition: commonTransition,
          },
        }
      case "zoom-in":
        return {
          hidden: {
            opacity: 0,
            scale: 0.92,
            transition: commonTransition,
          },
          visible: {
            opacity: 1,
            scale: 1,
            transition: commonTransition,
          },
          exit: {
            opacity: 0,
            scale: 1.08,
            transition: commonTransition,
          },
        }
      case "zoom-out":
        return {
          hidden: {
            opacity: 0,
            scale: 1.08,
            transition: commonTransition,
          },
          visible: {
            opacity: 1,
            scale: 1,
            transition: commonTransition,
          },
          exit: {
            opacity: 0,
            scale: 0.92,
            transition: commonTransition,
          },
        }
      case "blur-fade":
        return {
          hidden: {
            opacity: 0,
            filter: "blur(10px)",
            y: 30,
            transition: commonTransition,
          },
          visible: {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            transition: commonTransition,
          },
          exit: {
            opacity: 0,
            filter: "blur(10px)",
            y: -30,
            transition: commonTransition,
          },
        }
      default:
        return {
          hidden: { opacity: 0, transition: commonTransition },
          visible: { opacity: 1, transition: commonTransition },
          exit: { opacity: 0, transition: commonTransition },
        }
    }
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={animateState}
      variants={getVariants()}
      className={className}
    >
      {children}
    </motion.div>
  )
}
