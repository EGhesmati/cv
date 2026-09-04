import type { Metadata } from "next"
import { Inter, JetBrains_Mono, Zilla_Slab } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { RouteProgress } from "@/components/route-progress"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

const zillaSlab = Zilla_Slab({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
})

const zillaSlabHeading = Zilla_Slab({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
})

export const metadata: Metadata = {
  title: {
    default: "erfan.dev — Developer CLI",
    template: "%s — erfan.dev",
  },
  description:
    "Erfan Ghesmati — Computer Engineering Student & Full-Stack Developer. Build, explore, and connect through an interactive developer terminal.",
  metadataBase: new URL("https://erfanghesmati.com"),
  openGraph: {
    title: "erfan.dev — Developer CLI",
    description:
      "Computer Engineering Student & Full-Stack Developer",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${zillaSlab.variable} ${zillaSlabHeading.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="h-dvh overflow-hidden flex flex-col bg-background text-foreground">
        {/*
          Prevent the theme "sweep" flash on first paint: while the page is
          loading we disable CSS transitions so the resolved theme (light/dark,
          honoring system + saved preference) is applied instantly. The class is
          removed after `load`, once hydration has settled, so subsequent
          light↔dark toggles animate smoothly. Honors `prefers-reduced-motion`.
        */}
        <Script id="theme-transitions" strategy="beforeInteractive">
{`
(function () {
  var root = document.documentElement;
  if (!window.matchMedia || !root.classList) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  root.classList.add('no-theme-transition');
  var remove = function () { root.classList.remove('no-theme-transition'); };
  if (document.readyState === 'loading') {
    window.addEventListener('load', function () { setTimeout(remove); });
  } else {
    setTimeout(remove);
  }
})();
`}
        </Script>
        <ThemeProvider>
          <RouteProgress />
          <Header />
          <main className="flex flex-1 min-h-0 flex-col overflow-hidden page-enter">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
