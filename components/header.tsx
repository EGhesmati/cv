"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Moon, Sun, Menu, X } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState, useCallback } from "react"
import { runTerminalCommand, useTerminalView } from "@/lib/terminal-commands"

const navLinks = [
  { href: "/", label: "Home", command: "home", view: "home", display: "~" },
  { href: "/projects", label: "Projects", command: "projects", view: "projects", display: "projects" },
  { href: "/blog", label: "Blog", command: "blog", view: "blog", display: "blog" },
  { href: "/resume", label: "Resume", command: "resume", view: "resume", display: "resume" },
  { href: "/contact", label: "Contact", command: "contact", view: "contact", display: "contact" },
]

export function Header() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const activeView = useTerminalView()

  const openView = useCallback(
    (link: (typeof navLinks)[number]) => {
      setMobileOpen(false)
      if (!runTerminalCommand(link.command)) {
        // No terminal mounted (e.g. a non-terminal page) — fall back to route.
        router.push(link.href)
      }
    },
    [router]
  )

  const isActive = useCallback(
    (link: (typeof navLinks)[number]) => activeView === link.view,
    [activeView]
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
            <button
              key={link.href}
              type="button"
              onClick={() => openView(link)}
              aria-current={isActive(link) ? "true" : undefined}
              className={cn(
                "cursor-pointer rounded-sm px-2.5 py-1.5 text-xs font-medium font-mono no-underline transition-colors",
                isActive(link)
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <span className="text-gh-green/60">$</span> {link.display}
            </button>
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
              <button
                key={link.href}
                type="button"
                onClick={() => openView(link)}
                aria-current={isActive(link) ? "true" : undefined}
                className={cn(
                  "cursor-pointer rounded-sm px-3 py-2 text-left text-sm font-medium font-mono no-underline transition-colors",
                  isActive(link)
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <span className="text-gh-green/60">$</span> {link.display}
              </button>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
