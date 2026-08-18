"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"

/**
 * Thin top progress bar shown during client-side route transitions.
 * Only appears if the transition takes longer than ~150ms, so fast
 * navigations stay clean. Honors prefers-reduced-motion.
 */
export function RouteProgress() {
  const pathname = usePathname()
  const [state, setState] = useState<"idle" | "loading" | "done">("idle")
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null)
  const prevPath = useRef(pathname)

  useEffect(() => {
    if (pathname === prevPath.current) return
    prevPath.current = pathname

    // Route changed → transition finished
    setState("done")
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setState("idle"), 350)
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [pathname])

  // Listen for link clicks to detect navigation start
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a")
      if (!anchor) return
      const href = anchor.getAttribute("href")
      // Only internal links, not same-page anchors or external
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("http") ||
        href.startsWith("mailto") ||
        href === pathname
      ) return

      // Delay showing the bar so instant transitions never flash it
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => setState("loading"), 150)
    }
    document.addEventListener("click", onClick)
    return () => {
      document.removeEventListener("click", onClick)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [pathname])

  if (state === "idle") return null

  return (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[10000] h-[2px] bg-transparent"
    >
      <div
        className={
          state === "loading"
            ? "route-progress-bar h-full bg-accent"
            : "route-progress-done h-full bg-accent"
        }
      />
    </div>
  )
}
