"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ReactNode } from "react"

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      // Transitions are enabled so light↔dark swaps animate smoothly.
      // The initial-paint color sweep is prevented by a `beforeInteractive`
      // guard script (see app/layout.tsx) that adds `no-theme-transition`
      // to <html> until the app has hydrated and the theme is settled.
    >
      {children}
    </NextThemesProvider>
  )
}
