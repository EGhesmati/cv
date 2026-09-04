"use client"

import { useSyncExternalStore } from "react"

/**
 * Tiny dependency-free bridge between the sticky header "taskbar" and the
 * active TerminalShell on the page.
 *
 * The header dispatches a command (e.g. "projects") and the terminal runs it
 * in-place, so navigation never triggers a route reload while still letting
 * users deep-link directly to any route for SEO.
 */

type CommandHandler = (cmd: string) => void

const handlers = new Set<CommandHandler>()
const listeners = new Set<() => void>()
let view: string = "home"

function emit() {
  listeners.forEach((l) => l())
}

function subscribe(fn: () => void) {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

function getSnapshot() {
  return view
}

/** Hook for the header to reflect the terminal's currently open view. */
export function useTerminalView() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

/** The terminal publishes its active screen id on every change. */
export function setTerminalView(v: string) {
  if (v === view) return
  view = v
  emit()
}

/** The terminal registers its command executor while mounted. Returns an unregister fn. */
export function registerTerminalHandler(fn: CommandHandler) {
  handlers.add(fn)
  return () => {
    handlers.delete(fn)
  }
}

/**
 * Dispatch a command to the mounted terminal. Returns true if a terminal
 * handled it, false otherwise (caller may fall back to route navigation).
 */
export function runTerminalCommand(cmd: string): boolean {
  if (handlers.size === 0) return false
  handlers.forEach((h) => h(cmd))
  return true
}
