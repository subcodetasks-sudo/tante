import { useState } from "react"
import { createPortal } from "react-dom"
import { Play, Star, X } from "lucide-react"
import type { Testimonial } from "@/types/api"

type TestimonialCardProps = {
    testimonial: Testimonial
    className?: string
}

export function TestimonialCard({ testimonial, className = "" }: TestimonialCardProps) {
    const { name, rating, review, image, video } = testimonial
    const initial = name.charAt(0)
    const [isVideoOpen, setIsVideoOpen] = useState(false)

    return (
        <>
            <article
                className={`flex w-full flex-col justify-between overflow-hidden rounded-[2rem] border border-tant-gold/25 bg-tant-green-deep shadow-[0_8px_24px_rgba(0,0,0,0.25)] h-[400px] sm:h-[460px] md:h-[500px] p-4 sm:p-5 ${className}`}
            >
                {/* User Info & Rating (Top) */}
                <div className="flex items-center gap-3 shrink-0">
                    {image ? (
                        <img
                            src={image}
                            alt={name}
                            className="size-11 shrink-0 rounded-full border border-tant-gold/40 object-cover"
                            draggable={false}
                        />
                    ) : (
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-tant-gold/40 bg-tant-green font-display text-lg text-tant-gold">
                            {initial}
                        </span>
                    )}
                    <div className="min-w-0 flex-1">
                        <p className="truncate font-display text-base text-tant-gold">{name}</p>
                        {rating > 0 && (
                            <div className="mt-0.5 flex gap-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`size-3.5 ${
                                            i < rating
                                                ? "fill-tant-gold text-tant-gold"
                                                : "text-tant-gold/25"
                                        }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Review Text (Middle) */}
                <div className="my-3 shrink-0">
                    <p className="line-clamp-3 text-sm leading-relaxed text-tant-cream/90 md:text-base">
                        {review}
                    </p>
                </div>

                {/* Video / Visual Media Section (Bottom - Fills Remaining Space) */}
                <div className="relative flex-1 w-full min-h-[220px] overflow-hidden rounded-2xl border border-tant-gold/20 bg-black/40">
                    {video ? (
                        <div
                            onClick={() => setIsVideoOpen(true)}
                            className="group relative size-full cursor-pointer overflow-hidden"
                        >
                            <video
                                src={video}
                                playsInline
                                muted
                                preload="metadata"
                                className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-105"
                                aria-label={`فيديو مراجعة من ${name}`}
                            />
                            <div className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/20" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="flex size-14 items-center justify-center rounded-full border border-tant-gold/60 bg-tant-green-deep/80 text-tant-gold backdrop-blur-md shadow-lg transition-transform duration-300 group-hover:scale-110">
                                    <Play className="size-6 fill-tant-gold ml-0.5" />
                                </div>
                            </div>
                        </div>
                    ) : image ? (
                        <img
                            src={image}
                            alt={name}
                            className="absolute inset-0 size-full object-cover"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-tant-green/40 to-tant-green-deep">
                            <span className="font-display text-4xl text-tant-gold/30">{initial}</span>
                        </div>
                    )}
                </div>
            </article>

            {/* Video Modal Popup Portal */}
            {isVideoOpen && video && createPortal(
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-200"
                    onClick={() => setIsVideoOpen(false)}
                >
                    <div
                        className="relative flex max-h-[90vh] w-full max-w-4xl flex-col items-center overflow-hidden rounded-3xl border border-tant-gold/30 bg-tant-green-deep p-2 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => setIsVideoOpen(false)}
                            className="absolute top-4 right-4 z-10 flex size-10 items-center justify-center rounded-full border border-tant-gold/30 bg-tant-green-deep/80 text-tant-gold backdrop-blur-md transition-transform hover:scale-110"
                            aria-label="إغلاق الفيديو"
                        >
                            <X className="size-5" />
                        </button>
                        <video
                            src={video}
                            controls
                            autoPlay
                            playsInline
                            className="max-h-[85vh] w-full rounded-2xl object-contain"
                        />
                    </div>
                </div>,
                document.body
            )}
        </>
    )
}

export function TestimonialCardSkeleton({ className = "" }: { className?: string }) {
    return (
        <div
            className={`flex w-full flex-col justify-between overflow-hidden rounded-[2rem] border border-tant-gold/25 bg-tant-green-deep shadow-[0_8px_24px_rgba(0,0,0,0.25)] h-[400px] sm:h-[460px] md:h-[500px] p-4 sm:p-5 ${className}`}
        >
            <div className="flex items-center gap-3 shrink-0">
                <div className="size-11 animate-pulse rounded-full bg-tant-gold/15" />
                <div className="space-y-2 flex-1">
                    <div className="h-3 w-24 animate-pulse rounded bg-tant-gold/15" />
                    <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="size-3.5 animate-pulse rounded-full bg-tant-gold/15" />
                        ))}
                    </div>
                </div>
            </div>
            <div className="my-3 space-y-2 shrink-0">
                <div className="h-3 w-full animate-pulse rounded bg-tant-gold/15" />
                <div className="h-3 w-4/5 animate-pulse rounded bg-tant-gold/15" />
            </div>
            <div className="flex-1 w-full min-h-[220px] animate-pulse rounded-2xl border border-tant-gold/10 bg-tant-green/30" />
        </div>
    )
}
