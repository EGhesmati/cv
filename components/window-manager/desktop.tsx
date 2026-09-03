"use client"

import { useCallback, useRef } from "react"
import { Terminal } from "@/components/terminal"
import { cn } from "@/lib/utils"
import { WindowManagerProvider, useWindowManager } from "./window-context"
import { Window } from "./window"
import { Dock } from "./dock"
import type { WindowId } from "./types"
import { ProjectsWindow } from "./windows/projects-window"
import { BlogWindow } from "./windows/blog-window"
import { ResumeWindow } from "./windows/resume-window"
import { ContactWindow } from "./windows/contact-window"
import { AboutWindow } from "./windows/about-window"
import { SkillsWindow } from "./windows/skills-window"
import { GithubWindow } from "./windows/github-window"

const WINDOW_CONTENT: Record<WindowId, () => React.ReactNode> = {
  projects: ProjectsWindow,
  blog: BlogWindow,
  resume: ResumeWindow,
  contact: ContactWindow,
  about: AboutWindow,
  skills: SkillsWindow,
  github: GithubWindow,
}

const WINDOW_WIDTHS: Partial<Record<WindowId, string>> = {
  resume: "sm:w-[560px]",
  projects: "sm:w-[520px]",
  github: "sm:w-[520px]",
  blog: "sm:w-[460px]",
  contact: "sm:w-[400px]",
  about: "sm:w-[420px]",
  skills: "sm:w-[400px]",
}

function DesktopInner() {
  const { windows, openWindow, deactivateAll } = useWindowManager()
  const terminalFocusRef = useRef<() => void>(() => {})

  const focusTerminal = useCallback(() => {
    deactivateAll()
    terminalFocusRef.current()
  }, [deactivateAll])

  return (
    <div className="os-desktop relative">
      {/* Terminal = home/base application */}
      <Terminal
        bootCommands={["whoami"]}
        className="w-full"
        onOpenWindow={openWindow}
        focusRef={terminalFocusRef}
      />

      {/* Floating application windows (desktop); full-screen sheets on mobile */}
      {windows.map((w) => {
        const Content = WINDOW_CONTENT[w.id]
        return (
          <Window key={w.id} window={w} widthClassName={cn(WINDOW_WIDTHS[w.id])}>
            <Content />
          </Window>
        )
      })}

      {/* Dock */}
      <Dock onFocusTerminal={focusTerminal} />
    </div>
  )
}

export function Desktop() {
  return (
    <WindowManagerProvider>
      <DesktopInner />
    </WindowManagerProvider>
  )
}
