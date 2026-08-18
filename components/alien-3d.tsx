"use client"

import { useEffect, useId, useRef, useState } from "react"
import { useReducedMotion } from "@/lib/use-reduced-motion"

/**
 * Illustrated coding-alien mascot inside a UFO.
 * Isolated from the rest of the CV — remove from hero.tsx to delete.
 */
export function Alien3D() {
  const uid = useId().replace(/:/g, "")
  const reducedMotion = useReducedMotion()
  const wrapRef = useRef<HTMLDivElement>(null)
  const [look, setLook] = useState({ x: 0, y: 2.4 })

  useEffect(() => {
    if (reducedMotion) return
    const onMove = (event: MouseEvent) => {
      const el = wrapRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const nx = ((event.clientX - (rect.left + rect.width / 2)) / rect.width) * 2
      const ny = ((event.clientY - (rect.top + rect.height / 2)) / rect.height) * 2
      setLook({
        x: clamp(nx * 2.8, -2.8, 2.8),
        y: clamp(ny * 2 + 2.2, 0.8, 3.8),
      })
    }
    window.addEventListener("mousemove", onMove, { passive: true })
    return () => window.removeEventListener("mousemove", onMove)
  }, [reducedMotion])

  const g = {
    skin: `ufo-${uid}-skin`,
    shade: `ufo-${uid}-shade`,
    glass: `ufo-${uid}-glass`,
    hull: `ufo-${uid}-hull`,
    rim: `ufo-${uid}-rim`,
    beam: `ufo-${uid}-beam`,
    screen: `ufo-${uid}-screen`,
    glow: `ufo-${uid}-glow`,
    shadow: `ufo-${uid}-shadow`,
    clipDome: `ufo-${uid}-dome`,
  }

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="relative h-[240px] w-[210px] shrink-0 select-none sm:h-[280px] sm:w-[245px] lg:h-[320px] lg:w-[280px]"
    >
      <svg
        viewBox="0 0 260 270"
        className={reducedMotion ? "h-full w-full" : "alien-mascot h-full w-full"}
        fill="none"
      >
        <defs>
          <linearGradient id={g.skin} x1="88" y1="52" x2="172" y2="150">
            <stop offset="0%" stopColor="#d4e4da" />
            <stop offset="48%" stopColor="#9fb6aa" />
            <stop offset="100%" stopColor="#6d877b" />
          </linearGradient>
          <radialGradient id={g.shade} cx="46%" cy="34%" r="64%">
            <stop offset="0%" stopColor="#f3faf6" stopOpacity="0.55" />
            <stop offset="62%" stopColor="#9fb6aa" stopOpacity="0" />
            <stop offset="100%" stopColor="#3f564c" stopOpacity="0.28" />
          </radialGradient>
          <radialGradient id={g.glass} cx="50%" cy="28%" r="78%">
            <stop offset="0%" stopColor="#dce9ff" stopOpacity="0.28" />
            <stop offset="55%" stopColor="#8ac5ff" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#20123a" stopOpacity="0.08" />
          </radialGradient>
          <linearGradient id={g.hull} x1="20" y1="168" x2="240" y2="214">
            <stop offset="0%" stopColor="#3a3158" />
            <stop offset="45%" stopColor="#20123a" />
            <stop offset="100%" stopColor="#161022" />
          </linearGradient>
          <linearGradient id={g.rim} x1="30" y1="188" x2="230" y2="208">
            <stop offset="0%" stopColor="#6b5a96" />
            <stop offset="50%" stopColor="#9059ff" />
            <stop offset="100%" stopColor="#4d6dff" />
          </linearGradient>
          <linearGradient id={g.beam} x1="130" y1="208" x2="130" y2="262">
            <stop offset="0%" stopColor="#9059ff" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#9059ff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={g.screen} x1="96" y1="148" x2="164" y2="184">
            <stop offset="0%" stopColor="#2a1848" />
            <stop offset="100%" stopColor="#120c22" />
          </linearGradient>
          <radialGradient id={g.glow} cx="50%" cy="62%" r="52%">
            <stop offset="0%" stopColor="#9059ff" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#9059ff" stopOpacity="0" />
          </radialGradient>
          <filter id={g.shadow} x="-18%" y="-12%" width="136%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="7" floodColor="#20123a" floodOpacity="0.16" />
          </filter>
          <clipPath id={g.clipDome}>
            <ellipse cx="130" cy="128" rx="78" ry="86" />
          </clipPath>
        </defs>

        <ellipse cx="130" cy="248" rx="62" ry="7" fill="#20123a" opacity="0.1" />
        <circle cx="130" cy="148" r="116" fill={`url(#${g.glow})`} className={reducedMotion ? "" : "alien-halo"} />

        {/* Tractor beam */}
        <path d="M88 208 L54 262 H206 L172 208 Z" fill={`url(#${g.beam})`} className={reducedMotion ? "" : "alien-beam"} />

        <g filter={`url(#${g.shadow})`}>
          {/* Glass dome */}
          <ellipse cx="130" cy="128" rx="78" ry="86" fill={`url(#${g.glass})`} />
          <ellipse cx="130" cy="128" rx="78" ry="86" stroke="#8ac5ff" strokeOpacity="0.28" strokeWidth="1.4" />
          <path
            d="M68 118c8-42 34-70 62-70s54 28 62 70"
            stroke="#ffffff"
            strokeOpacity="0.22"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Occupant clipped to dome */}
          <g clipPath={`url(#${g.clipDome})`}>
            {/* Hoodie / torso */}
            <path
              d="M92 148c7-14 20-22 38-22s31 8 38 22c8 16 9 34 3 46-5 10-18 15-41 15s-36-5-41-15c-6-12-5-30 3-46Z"
              fill="#20123a"
            />
            <path
              d="M104 156c5-8 13-12 26-12s21 4 26 12c6 10 6 22 1 30-3 6-12 9-27 9s-24-3-27-9c-5-8-5-20 1-30Z"
              fill="#2a1d48"
            />

            {/* Hands + laptop */}
            <ellipse cx="96" cy="186" rx="8" ry="5.5" fill="#8aa89a" />
            <ellipse cx="164" cy="186" rx="8" ry="5.5" fill="#8aa89a" />
            <path d="M86 188h88l5 12H81l5-12Z" fill="#2a2340" />
            <rect x="94" y="150" width="72" height="40" rx="3" fill="#1a1230" />
            <rect x="97" y="153" width="66" height="34" rx="2" fill={`url(#${g.screen})`} />
            <rect x="101" y="158" width="20" height="2.4" rx="1.2" fill="#9059ff" />
            <rect x="124" y="158" width="14" height="2.4" rx="1.2" fill="#8ac5ff" opacity="0.9" />
            <rect x="104" y="165" width="16" height="2.4" rx="1.2" fill="#8ac5ff" opacity="0.7" />
            <rect x="123" y="165" width="24" height="2.4" rx="1.2" fill="#80dd9c" opacity="0.85" />
            <rect x="104" y="172" width="28" height="2.4" rx="1.2" fill="#8ac5ff" opacity="0.5" />
            <rect x="104" y="179" width="12" height="2.4" rx="1.2" fill="#9059ff" opacity="0.8" />
            <rect
              x="138"
              y="178"
              width="1.6"
              height="5.5"
              rx="0.8"
              fill="#f7f6fb"
              className={reducedMotion ? "" : "alien-cursor"}
            />

            {/* Neck + head */}
            <path d="M118 136c2 6 5 9 12 9s10-3 12-9c-8 3-16 3-24 0Z" fill="#7a988a" />
            <path
              d="M96 62c8-16 22-24 34-24s26 8 34 24c12 20 14 44 8 64-5 16-18 26-42 26s-37-10-42-26c-6-20-4-44 8-64Z"
              fill={`url(#${g.skin})`}
            />
            <ellipse cx="130" cy="104" rx="42" ry="52" fill={`url(#${g.shade})`} />

            <Feeler side="left" reducedMotion={reducedMotion} />
            <Feeler side="right" reducedMotion={reducedMotion} />

            <path
              d="M104 90c8-8 17-12 26-12s18 4 26 12"
              stroke="#5f7d70"
              strokeWidth="2.4"
              strokeLinecap="round"
              opacity="0.32"
            />

            <Eye cx={114} cy={106} look={look} blink={!reducedMotion} />
            <Eye cx={146} cy={106} look={look} blink={!reducedMotion} />
            <path d="M124 128c3 2.4 9 2.4 12 0" stroke="#4d6b5e" strokeWidth="2" strokeLinecap="round" />
          </g>

          {/* Dome highlight over occupant */}
          <path
            d="M74 108c10-40 32-62 56-62"
            stroke="#ffffff"
            strokeOpacity="0.18"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Saucer hull */}
          <ellipse cx="130" cy="196" rx="108" ry="22" fill={`url(#${g.hull})`} />
          <ellipse cx="130" cy="192" rx="92" ry="12" fill="#2a2348" />
          <ellipse cx="130" cy="190" rx="58" ry="7" fill="#161022" opacity="0.55" />
          <path d="M34 196c8 16 48 28 96 28s88-12 96-28" stroke={`url(#${g.rim})`} strokeWidth="3" strokeLinecap="round" />

          {/* Rim lights */}
          {[58, 86, 114, 146, 174, 202].map((x, i) => (
            <circle
              key={x}
              cx={x}
              cy={204}
              r="3.2"
              fill={i % 2 === 0 ? "#9059ff" : "#8ac5ff"}
              className={reducedMotion ? "" : i % 2 === 0 ? "alien-orb" : "alien-orb-delay"}
            />
          ))}
        </g>
      </svg>
    </div>
  )
}

function Feeler({
  side,
  reducedMotion,
}: {
  side: "left" | "right"
  reducedMotion: boolean
}) {
  const isLeft = side === "left"
  const stem = isLeft
    ? "M108 72 C104 58 98 50 92 46"
    : "M152 72 C156 58 162 50 168 46"
  const cx = isLeft ? 90 : 170
  const cy = 44

  return (
    <g>
      <path
        d={stem}
        stroke="#6d877b"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={stem}
        stroke="#c9ddd2"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.55"
      />
      <circle cx={isLeft ? 108 : 152} cy="72" r="2.4" fill="#7a988a" />
      <circle cx={cx} cy={cy} r="6" fill="#6b3fd4" />
      <circle
        cx={cx}
        cy={cy}
        r="4.4"
        fill="#9059ff"
        className={reducedMotion ? "" : isLeft ? "alien-orb" : "alien-orb-delay"}
      />
      <circle cx={cx - 1.2} cy={cy - 1.4} r="1.4" fill="#e8dcff" />
    </g>
  )
}

function Eye({
  cx,
  cy,
  look,
  blink,
}: {
  cx: number
  cy: number
  look: { x: number; y: number }
  blink: boolean
}) {
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <ellipse cx="0" cy="0" rx="13" ry="16" fill="#1a1238" />
      <ellipse cx={look.x} cy={look.y} rx="4.4" ry="5.2" fill="#8ac5ff" opacity="0.85" />
      <ellipse cx={look.x} cy={look.y} rx="2.6" ry="3.1" fill="#0a0820" />
      <circle cx={look.x + 1.2} cy={look.y - 1.8} r="1.1" fill="#fff" />
      {blink && (
        <>
          <ellipse className="alien-lid-top" cx="0" cy="-13" rx="13" ry="6.5" fill="#8aa89a" />
          <ellipse className="alien-lid-bot" cx="0" cy="13" rx="13" ry="5.5" fill="#7a988a" />
        </>
      )}
    </g>
  )
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}
