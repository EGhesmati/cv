"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Moon, Sun, Menu, X } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState, useCallback } from "react"

const navLinks = [
  { href: "/", label: "Home", command: "~" },
  { href: "/projects", label: "Projects", command: "projects" },
  { href: "/blog", label: "Blog", command: "blog" },
  { href: "/resume", label: "Resume", command: "resume" },
  { href: "/contact", label: "Contact", command: "contact" },
]

export function Header() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = useCallback(
    (href: string) => {
      if (href === "/") return pathname === "/"
      return pathname === href || pathname.startsWith(href + "/")
    },
    [pathname]
  )

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark")
  }, [theme, setTheme])

  return (
    <header className="sticky top-0 isolate z-[9999] w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <div className="layout-shell flex h-12 items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-mono text-sm font-semibold text-foreground no-underline transition-opacity hover:opacity-80"
          aria-label="erfan.dev"
        >
          <span className="text-gh-green">erfan</span>
          <span className="text-muted-foreground">@</span>
          <span className="text-muted-foreground">dev</span>
          <span className="text-muted-foreground">:</span>
          <span className="text-gh-blue">~</span>
          <span className="text-foreground">$</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-0.5" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-sm px-2.5 py-1.5 text-xs font-medium font-mono no-underline transition-colors",
                isActive(link.href)
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <span className="text-gh-green/60">$</span> {link.command}
            </Link>
          ))}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="relative ml-1 size-7 border-border bg-background/80 hover:bg-secondary"
            suppressHydrationWarning
          >
            <Sun className="size-3.5 rotate-0 scale-100 text-foreground/80 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute size-3.5 rotate-90 scale-0 text-foreground/80 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </nav>

        {/* Mobile controls */}
        <div className="flex sm:hidden items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="relative size-7 border-border bg-background/80 hover:bg-secondary"
            suppressHydrationWarning
          >
            <Sun className="size-3.5 rotate-0 scale-100 text-foreground/80 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute size-3.5 rotate-90 scale-0 text-foreground/80 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            className="size-7"
          >
            {mobileOpen ? <X className="size-3.5" /> : <Menu className="size-3.5" />}
          </Button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="sm:hidden border-t border-border bg-background py-2" aria-label="Mobile navigation">
          <div className="layout-shell flex flex-col gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-sm px-3 py-2 text-sm font-medium font-mono no-underline transition-colors",
                  isActive(link.href)
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <span className="text-gh-green/60">$</span> {link.command}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
