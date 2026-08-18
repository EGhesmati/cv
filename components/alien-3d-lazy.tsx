"use client"

/**
 * Alien3DLazy — dynamically imports the heavy Three.js scene on the client
 * only. The placeholder keeps the same fixed dimensions so there is zero
 * layout shift while the bundle loads.
 */
import dynamic from "next/dynamic"

export const Alien3DLazy = dynamic(
  () => import("./alien-3d").then((m) => ({ default: m.Alien3D })),
  {
    ssr: false,
    loading: () => (
      // Same size as the canvas — prevents layout shift
      <div
        aria-hidden="true"
        className="h-[240px] w-[210px] shrink-0 sm:h-[280px] sm:w-[245px] lg:h-[320px] lg:w-[280px]"
      />
    ),
  }
)
