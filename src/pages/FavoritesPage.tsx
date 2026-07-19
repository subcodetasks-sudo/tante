import { Link } from "react-router-dom"
import { motion } from "motion/react"
import { Heart } from "lucide-react"

export default function FavoritesPage() {
  return (
    <div className="flex min-h-[70svh] flex-col items-center justify-center px-4 py-16 text-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="flex flex-col items-center gap-5"
      >
        <div className="flex size-20 items-center justify-center rounded-full border border-[rgba(90,120,85,0.55)] bg-[rgba(46,71,42,0.45)]">
          <Heart className="size-9 text-tant-gold" strokeWidth={1.5} />
        </div>
        <h1 className="font-arabic text-3xl text-tant-gold md:text-4xl">
          المفضلة
        </h1>
        <p className="max-w-sm text-base text-tant-gold-soft/90">
          قائمة المفضلة قادمة قريباً — احفظ أطباقك المفضلة هنا لاحقاً.
        </p>
        <Link
          to="/menu"
          viewTransition={true}
          className="btn-gold mt-2 rounded-full px-8 py-2.5 font-arabic text-lg"
        >
          تصفح القائمة
        </Link>
      </motion.div>
    </div>
  )
}
