"use client"

import {
  useCallback,
  useEffect,
  useRef,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react"
import { Maximize2, Minimize2, Minus, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useWindowManager } from "./window-context"
import type { WindowState } from "./types"

interface WindowProps {
  window: WindowState
  children: ReactNode
  /** Optional fixed width class for the floating (desktop) window */
  widthClassName?: string
}

export function Window({ window: win, children, widthClassName }: WindowProps) {
  const {
    activeId,
    closeWindow,
    minimizeWindow,
    toggleMaximize,
    focusWindow,
    moveWindow,
  } = useWindowManager()

  const rootRef = useRef<HTMLDivElement>(null)
  const dragState = useRef<{
    pointerId: number
    startX: number
    startY: number
    baseX: number
    baseY: number
  } | null>(null)

  const isActive = activeId === win.id

  // Escape closes the active window
  useEffect(() => {
    if (!isActive) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation()
        closeWindow(win.id)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isActive, closeWindow, win.id])

  const onTitlebarPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (win.maximized) return
      // Only drag with primary button / touch, and not from control buttons
      if (e.button !== 0) return
      if ((e.target as HTMLElement).closest("button")) return
      focusWindow(win.id)
      dragState.current = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        baseX: win.x,
        baseY: win.y,
      }
      e.currentTarget.setPointerCapture(e.pointerId)
    },
    [win.maximized, win.x, win.y, win.id, focusWindow]
  )

  const onTitlebarPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      const drag = dragState.current
      if (!drag || drag.pointerId !== e.pointerId) return
      const parent = rootRef.current?.offsetParent as HTMLElement | null
      const nextX = drag.baseX + (e.clientX - drag.startX)
      const nextY = drag.baseY + (e.clientY - drag.startY)
      if (parent) {
        const maxX = Math.max(0, parent.clientWidth - 120)
        const maxY = Math.max(0, parent.clientHeight - 48)
        moveWindow(
          win.id,
          Math.min(Math.max(0, nextX), maxX),
          Math.min(Math.max(0, nextY), maxY)
        )
      } else {
        moveWindow(win.id, nextX, nextY)
      }
    },
    [moveWindow, win.id]
  )

  const onTitlebarPointerUp = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (dragState.current?.pointerId === e.pointerId) {
        dragState.current = null
      }
    },
    []
  )

  if (win.minimized) return null

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-label={win.title}
      aria-modal="false"
      tabIndex={-1}
      onPointerDown={() => focusWindow(win.id)}
      className={cn(
        "os-window",
        isActive && "os-window-active",
        // Mobile: full-screen app view. Desktop: floating window.
        "max-sm:fixed max-sm:inset-0 max-sm:z-[80] max-sm:!transform-none",
        win.maximized && "os-window-maximized"
      )}
      style={{
        zIndex: win.z,
        ...(win.maximized
          ? undefined
          : ({
              "--wx": `${win.x}px`,
              "--wy": `${win.y}px`,
            } as React.CSSProperties)),
      }}
      data-maximized={win.maximized || undefined}
    >
      {/* Title bar */}
      <div
        className="os-window-titlebar"
        onPointerDown={onTitlebarPointerDown}
        onPointerMove={onTitlebarPointerMove}
        onPointerUp={onTitlebarPointerUp}
        onDoubleClick={() => toggleMaximize(win.id)}
      >
        <div className="flex items-center gap-1.5 shrink-0" aria-hidden="true">
          <button
            onClick={() => closeWindow(win.id)}
            aria-label={`Close ${win.title}`}
            className="os-window-dot bg-gh-red hover:brightness-110"
          />
          <button
            onClick={() => minimizeWindow(win.id)}
            aria-label={`Minimize ${win.title}`}
            className="os-window-dot bg-gh-orange hover:brightness-110 max-sm:hidden"
          />
          <button
            onClick={() => toggleMaximize(win.id)}
            aria-label={win.maximized ? `Restore ${win.title}` : `Maximize ${win.title}`}
            className="os-window-dot bg-gh-green hover:brightness-110 max-sm:hidden"
          />
        </div>
        <span className="min-w-0 flex-1 truncate text-center font-mono text-xs text-muted-foreground select-none">
          {win.title}
        </span>
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            onClick={() => minimizeWindow(win.id)}
            aria-label={`Minimize ${win.title}`}
            className="os-window-btn max-sm:hidden"
          >
            <Minus className="size-3.5" />
          </button>
          <button
            onClick={() => toggleMaximize(win.id)}
            aria-label={win.maximized ? `Restore ${win.title}` : `Maximize ${win.title}`}
            className="os-window-btn max-sm:hidden"
          >
            {win.maximized ? (
              <Minimize2 className="size-3.5" />
            ) : (
              <Maximize2 className="size-3.5" />
            )}
          </button>
          <button
            onClick={() => closeWindow(win.id)}
            aria-label={`Close ${win.title}`}
            className="os-window-btn hover:text-gh-red"
          >
            <X className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="os-window-body">{children}</div>
    </div>
  )
}
