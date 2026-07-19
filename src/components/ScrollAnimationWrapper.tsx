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

interface ScrollAnimationWrapperProps {
  children: ReactNode
  className?: string
  type?: AnimationType
  delay?: number
  duration?: number
  threshold?: number
  once?: boolean
}

export function ScrollAnimationWrapper({
  children,
  className = "",
  type = "fade-up",
  delay = 0,
  duration = 0.6,
  threshold = 0.15,
  once = false,
}: ScrollAnimationWrapperProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount: threshold })
  const [hasEntered, setHasEntered] = useState(false)

  useEffect(() => {
    if (isInView) {
      setHasEntered(true)
    }
  }, [isInView])

  const animateState = isInView ? "visible" : hasEntered ? "exit" : "hidden"

  const getVariants = () => {
    const commonTransition = {
      duration,
      ease: [0.25, 1, 0.5, 1] as const,
      delay,
    }

    switch (type) {
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
            x: 50,
            transition: commonTransition,
          },
          visible: {
            opacity: 1,
            x: 0,
            transition: commonTransition,
          },
          exit: {
            opacity: 0,
            x: -50,
            transition: commonTransition,
          },
        }
      case "fade-right":
        return {
          hidden: {
            opacity: 0,
            x: -50,
            transition: commonTransition,
          },
          visible: {
            opacity: 1,
            x: 0,
            transition: commonTransition,
          },
          exit: {
            opacity: 0,
            x: 50,
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
