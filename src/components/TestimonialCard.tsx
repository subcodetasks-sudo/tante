import { useState } from "react"
import { createPortal } from "react-dom"
import { Play, X } from "lucide-react"
import type { Testimonial } from "@/types/api"

type TestimonialCardProps = {
    testimonial: Testimonial
    className?: string
}

export function TestimonialCard({ testimonial, className = "" }: TestimonialCardProps) {
    const { name, video } = testimonial
    const [isVideoOpen, setIsVideoOpen] = useState(false)

    if (!video) return null

    return (
        <>
            <article
                className={`overflow-hidden rounded-[2rem] border border-tant-gold/25 bg-tant-green-deep shadow-[0_8px_24px_rgba(0,0,0,0.25)] h-[400px] sm:h-[460px] md:h-[500px] ${className}`}
            >
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
            </article>

            {isVideoOpen && createPortal(
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
            className={`overflow-hidden rounded-[2rem] border border-tant-gold/25 bg-tant-green-deep shadow-[0_8px_24px_rgba(0,0,0,0.25)] h-[400px] sm:h-[460px] md:h-[500px] ${className}`}
        >
            <div className="size-full animate-pulse bg-tant-green/30" />
        </div>
    )
}
