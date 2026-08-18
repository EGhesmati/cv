import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Alien3DLazy } from "@/components/alien-3d-lazy"

export function Hero() {
  return (
    <section className="section-wrap">
      <div className="layout-shell flex items-center justify-between gap-6 lg:gap-10">
        {/* ── Left: all existing text content — unchanged ── */}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Software engineering
          </p>
          <h1 className="mt-3 max-w-3xl font-heading text-4xl font-bold leading-[1.08] tracking-[-0.025em] text-foreground sm:text-5xl lg:text-6xl">
            Erfan Ghesmati
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-foreground/75 sm:text-lg">
            Software Engineer based in Turkey.
            I build clean, accessible, and performant web experiences.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/projects"
              className={cn(buttonVariants(), "no-underline")}
            >
              Projects
              <ArrowRight className="size-3.5" />
            </Link>
            <Link
              href="/blog"
              className={cn(buttonVariants({ variant: "outline" }), "no-underline")}
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className={cn(buttonVariants({ variant: "secondary" }), "no-underline")}
            >
              Contact
            </Link>
          </div>
        </div>

        {/* ── Right: 3D alien mascot — hidden on very small screens ── */}
        <div className="hidden sm:flex shrink-0 items-center justify-center">
          <Alien3DLazy />
        </div>
      </div>
    </section>
  )
}
