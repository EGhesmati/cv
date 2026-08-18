/**
 * AlienIcon — a small decorative alien SVG used as a developer signature
 * near the hero name. Easy to remove: just delete this file and the
 * <AlienIcon /> usage in hero.tsx.
 */
export function AlienIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {/* Head */}
      <ellipse cx="12" cy="11" rx="6.5" ry="8" />
      {/* Left eye */}
      <ellipse cx="9.5" cy="10" rx="1.5" ry="2" fill="currentColor" stroke="none" />
      {/* Right eye */}
      <ellipse cx="14.5" cy="10" rx="1.5" ry="2" fill="currentColor" stroke="none" />
      {/* Mouth — small curve */}
      <path d="M10 14.5 Q12 16 14 14.5" />
      {/* Left antenna */}
      <line x1="8" y1="3.5" x2="6" y2="1.5" />
      <circle cx="5.75" cy="1.25" r="0.5" fill="currentColor" stroke="none" />
      {/* Right antenna */}
      <line x1="16" y1="3.5" x2="18" y2="1.5" />
      <circle cx="18.25" cy="1.25" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  )
}
