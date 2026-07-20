import { Link } from "react-router-dom"
import { motion } from "motion/react"

export default function NotFoundPage() {
  return (
    <>
      <title>الصفحة غير موجودة — طنط</title>
      <div className="flex min-h-[70svh] flex-col items-center justify-center px-4 py-16 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="flex flex-col items-center gap-6"
      >
        <div className="relative flex size-44 items-center justify-center md:size-52">
          <div className="absolute inset-0 rounded-full border border-tant-gold/50" />
          <div className="absolute inset-2 rounded-full border border-tant-gold/35" />
          <span className="font-display text-6xl tracking-wide text-tant-gold-soft md:text-7xl">
            404
          </span>
        </div>

        <h1 className="font-arabic text-3xl text-tant-gold md:text-4xl">
          الصفحة غير موجودة
        </h1>
        <p className="max-w-sm text-base text-tant-gold-soft/90">
          يبدو أن هذا الطبق غير موجود في قائمتنا اليوم.
        </p>

        <Link
          to="/"
          viewTransition={true}
          className="btn-gold mt-2 rounded-full px-8 py-2.5 font-arabic text-lg"
        >
          العودة للرئيسية
        </Link>
      </motion.div>
    </div>
    </>
  )
}
