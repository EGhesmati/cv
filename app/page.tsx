import { Desktop } from "@/components/window-manager/desktop"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "erfan.dev — Developer CLI",
  description:
    "Erfan Ghesmati — Computer Engineering Student & Full-Stack Developer. Build, explore, and connect through an interactive developer terminal.",
  openGraph: {
    title: "erfan.dev — Developer CLI",
    description:
      "Computer Engineering Student & Full-Stack Developer",
    type: "website",
    locale: "en_US",
  },
}

export default function Home() {
  return (
    <section className="flex items-start justify-center py-6 sm:py-10">
      <div className="w-full max-w-4xl px-4 sm:px-6">
        <Desktop />

        {/* Recruiter escape hatch */}
        <div className="mt-6 space-y-3">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <a
              href="/resume"
              className="px-4 py-2 rounded-sm border border-gh-green/50 bg-gh-green/10 text-gh-green font-medium text-sm hover:bg-gh-green/20 transition-colors no-underline min-h-[40px] inline-flex items-center"
            >
              View Resume
            </a>
            <a
              href="/contact"
              className="px-4 py-2 rounded-sm border border-border text-foreground/80 text-sm hover:text-foreground hover:border-foreground/30 transition-colors no-underline min-h-[40px] inline-flex items-center"
            >
              Contact
            </a>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {[
              { href: "/projects", label: "Projects" },
              { href: "/blog", label: "Blog" },
              { href: "https://github.com/EGhesmati", label: "GitHub", external: true },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                {...("external" in link && link.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="hover:text-foreground transition-colors no-underline"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
