"use client"

import { TerminalSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import { useWindowManager } from "./window-context"

interface DockProps {
  onFocusTerminal: () => void
}

export function Dock({ onFocusTerminal }: DockProps) {
  const { windows, activeId, focusWindow } = useWindowManager()

  return (
    <div
      className="os-dock"
      role="toolbar"
      aria-label="Open applications"
    >
      <button
        onClick={onFocusTerminal}
        className={cn(
          "os-dock-item",
          activeId === null && "os-dock-item-active"
        )}
        aria-label="Terminal"
      >
        <TerminalSquare className="size-3.5" />
        <span>Terminal</span>
      </button>

      {windows.map((w) => (
        <button
          key={w.id}
          onClick={() => focusWindow(w.id)}
          className={cn(
            "os-dock-item",
            activeId === w.id && !w.minimized && "os-dock-item-active"
          )}
          aria-pressed={!w.minimized}
          aria-label={`${w.title}${w.minimized ? " (minimized)" : ""}`}
        >
          <span className="max-w-28 truncate">
            {w.title.split(" — ")[0]}
          </span>
          {w.minimized && (
            <span
              className="size-1.5 rounded-full bg-gh-orange"
              aria-hidden="true"
            />
          )}
        </button>
      ))}
    </div>
  )
}
