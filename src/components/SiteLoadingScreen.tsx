import { motion } from "motion/react"
import { SiteLogo } from "@/components/SiteLogo"

export function SiteLoadingScreen() {
  return (
    <div
      className="site-boot-screen fixed inset-0 z-100 flex flex-col items-center justify-center overflow-hidden bg-tant-green-deep"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 55% at 50% 42%, color-mix(in srgb, var(--tant-gold) 22%, transparent), transparent 70%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            'url("/arabic-traditional-motif-texture-background-elegant-luxury-backdrop-with-islamic-themed-decorative-ornament-pattern-dark-green-gradation-with-illustration-of-geometric-lines-and-circles-vector.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          maskImage:
            "radial-gradient(ellipse 55% 50% at 50% 45%, #000 0%, transparent 72%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 55% 50% at 50% 45%, #000 0%, transparent 72%)",
        }}
        aria-hidden
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, filter: "blur(8px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex flex-col items-center gap-8 px-6"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <div
            className="absolute -inset-8 rounded-full bg-tant-gold/10 blur-2xl"
            aria-hidden
          />
          <SiteLogo
            alt="طنط"
            className="relative rounded-2xl h-20 w-auto object-contain drop-shadow-[0_8px_28px_rgba(0,0,0,0.45)] md:h-28"
          />
        </motion.div>

        <div className="flex w-44 flex-col items-center gap-3 sm:w-52">
          <div className="relative h-0.5 w-full overflow-hidden rounded-full bg-tant-gold/15">
            <motion.div
              className="absolute inset-y-0 w-1/3 rounded-full bg-linear-to-l from-transparent via-tant-gold to-transparent"
              animate={{ x: ["-100%", "300%"] }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.45, 0.9, 0.45] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="font-display text-xs tracking-[0.28em] text-tant-gold/75 uppercase"
          >
            جاري التحميل
          </motion.p>
        </div>
      </motion.div>
    </div>
  )
}
