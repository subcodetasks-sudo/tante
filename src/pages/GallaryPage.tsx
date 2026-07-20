import { useEffect, useMemo } from "react"
import { AnimatePresence, motion } from "motion/react"
import DomeGallery from "@/components/DomeGallery"
import { toGalleryMediaItem } from "@/lib/gallery"
import { useGalleryStore } from "@/store/galleryStore"
import { Skeleton } from "@/components/ui/skeleton"

export default function GallaryPage() {
  const items = useGalleryStore((s) => s.items)
  const status = useGalleryStore((s) => s.status)
  const error = useGalleryStore((s) => s.error)
  const fetchGallery = useGalleryStore((s) => s.fetchGallery)

  useEffect(() => {
    void fetchGallery()
  }, [fetchGallery])

  const mediaItems = useMemo(
    () =>
      items
        .map(toGalleryMediaItem)
        .filter((item): item is NonNullable<typeof item> => item != null),
    [items],
  )

  return (
    <AnimatePresence mode="wait">
      {status === "loading" && mediaItems.length === 0 ? (
        <motion.div
          key="skeleton"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="-mt-[5.25rem] flex h-dvh w-full flex-col p-6 pt-24 md:-mt-[6rem] md:p-10 md:pt-28"
        >
          <div className="mb-6">
            <Skeleton className="h-8 w-40 rounded-xl" />
            <Skeleton className="mt-2 h-4 w-64 rounded-lg" />
          </div>
          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-hidden">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton
                key={i}
                className={`w-full rounded-2xl border border-tant-gold/15 ${
                  i % 3 === 0 ? "row-span-2 h-full" : "h-48 md:h-64"
                }`}
              />
            ))}
          </div>
        </motion.div>
      ) : status === "error" && mediaItems.length === 0 ? (
        <motion.div
          key="error"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="-mt-[5.25rem] flex h-dvh w-full items-center justify-center px-4 text-center text-tant-muted md:-mt-[6rem]"
        >
          {error ?? "تعذر تحميل المعرض"}
        </motion.div>
      ) : mediaItems.length === 0 ? (
        <motion.div
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="-mt-[5.25rem] flex h-dvh w-full items-center justify-center text-tant-muted md:-mt-[6rem]"
        >
          لا توجد عناصر في المعرض بعد.
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="-mt-[5.25rem] h-dvh w-full md:-mt-[6rem]"
        >
          <DomeGallery
            images={mediaItems}
            overlayBlurColor="#2e472a"
            grayscale={false}
            fit={0.9}
            minRadius={900}
            segments={40}
            openedImageWidth="min(580px, calc(100vw - 2rem))"
            openedImageBorderRadius="16px"
            openedImageHeight="min(580px, calc(100dvh - 8rem))"
            autoRotate
            autoRotateSpeed={6}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
