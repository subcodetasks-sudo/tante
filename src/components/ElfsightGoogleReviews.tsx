import { useEffect, useRef, useState } from "react"

const WIDGET_CLASS = import.meta.env.PUBLIC_ELFSIGHT_WIDGET_CLASS
const PLATFORM_SRC = import.meta.env.PUBLIC_ELFSIGHT_PLATFORM_SRC
const LOAD_TIMEOUT_MS = Number(import.meta.env.PUBLIC_ELFSIGHT_LOAD_TIMEOUT_MS) || 10_000

const FAIL_PATTERN =
    /view\s*limit|views?\s*(limit|expired|deactivated|over)|widget.*(deactivated|disabled|unavailable)|upgrade\s*(your|to)|quota|limit\s*reached|subscription\s*(expired|required)|free\s*plan/i

function ensurePlatformScript() {
    if (document.querySelector(`script[src="${PLATFORM_SRC}"]`)) return

    const script = document.createElement("script")
    script.src = PLATFORM_SRC
    script.async = true
    document.body.appendChild(script)
}

function hasFailureSignal(root: HTMLElement) {
    return FAIL_PATTERN.test(root.textContent ?? "")
}

function hasHealthyWidget(root: HTMLElement) {
    if (hasFailureSignal(root)) return false
    if (root.querySelector("iframe")) return true

    const widgetRoot = root.querySelector(
        '[class*="eapps-widget"], [class*="Widget"], [class*="es-widget"], [class*="eapps"], [class*="Review"]',
    )
    if (widgetRoot && !hasFailureSignal(widgetRoot as HTMLElement)) {
        return true
    }

    return false
}

type LoadStatus = "pending" | "ready" | "failed"

export function ElfsightGoogleReviews() {
    const hostRef = useRef<HTMLDivElement>(null)
    const [status, setStatus] = useState<LoadStatus>("pending")

    useEffect(() => {
        ensurePlatformScript()

        const host = hostRef.current
        if (!host) return

        let settled = false

        const settle = (next: LoadStatus) => {
            if (settled || next === "pending") return
            settled = true
            setStatus(next)
        }

        const evaluate = () => {
            if (hasFailureSignal(host)) {
                settle("failed")
                return
            }
            if (hasHealthyWidget(host)) {
                settle("ready")
            }
        }

        const observer = new MutationObserver(evaluate)
        observer.observe(host, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: true,
        })

        evaluate()

        const timeoutId = window.setTimeout(() => {
            settle(hasHealthyWidget(host) ? "ready" : "failed")
        }, LOAD_TIMEOUT_MS)

        return () => {
            observer.disconnect()
            window.clearTimeout(timeoutId)
        }
    }, [])

    if (status === "failed") return null

    return (
        <div
            className={
                status === "ready"
                    ? "mx-auto w-full max-w-4xl"
                    : "pointer-events-none absolute -z-10 h-px w-px overflow-hidden opacity-0"
            }
            aria-hidden={status !== "ready"}
        >
            <div ref={hostRef} className={WIDGET_CLASS} />
        </div>
    )
}
