"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { WINDOW_TITLES, type WindowId, type WindowState } from "./types"

interface WindowManagerContextValue {
  windows: WindowState[]
  activeId: WindowId | null
  openWindow: (id: WindowId) => void
  closeWindow: (id: WindowId) => void
  minimizeWindow: (id: WindowId) => void
  toggleMaximize: (id: WindowId) => void
  focusWindow: (id: WindowId) => void
  moveWindow: (id: WindowId, x: number, y: number) => void
  deactivateAll: () => void
}

const WindowManagerContext = createContext<WindowManagerContextValue | null>(
  null
)

export function useWindowManager() {
  const ctx = useContext(WindowManagerContext)
  if (!ctx) {
    throw new Error("useWindowManager must be used within WindowManagerProvider")
  }
  return ctx
}

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<WindowState[]>([])
  const [activeId, setActiveId] = useState<WindowId | null>(null)
  const zCounter = useRef(10)
  const openCount = useRef(0)

  const focusWindow = useCallback((id: WindowId) => {
    zCounter.current += 1
    const z = zCounter.current
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, z, minimized: false } : w))
    )
    setActiveId(id)
  }, [])

  const openWindow = useCallback(
    (id: WindowId) => {
      setWindows((prev) => {
        const existing = prev.find((w) => w.id === id)
        zCounter.current += 1
        const z = zCounter.current
        if (existing) {
          return prev.map((w) =>
            w.id === id ? { ...w, z, minimized: false } : w
          )
        }
        // Cascade new windows
        const offset = (openCount.current % 5) * 28
        openCount.current += 1
        return [
          ...prev,
          {
            id,
            title: WINDOW_TITLES[id],
            minimized: false,
            maximized: false,
            z,
            x: 24 + offset,
            y: 16 + offset,
          },
        ]
      })
      setActiveId(id)
    },
    []
  )

  const closeWindow = useCallback(
    (id: WindowId) => {
      setWindows((prev) => prev.filter((w) => w.id !== id))
      setActiveId((current) => (current === id ? null : current))
    },
    []
  )

  const minimizeWindow = useCallback(
    (id: WindowId) => {
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, minimized: true } : w))
      )
      setActiveId((current) => (current === id ? null : current))
    },
    []
  )

  const toggleMaximize = useCallback((id: WindowId) => {
    zCounter.current += 1
    const z = zCounter.current
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, maximized: !w.maximized, minimized: false, z } : w
      )
    )
    setActiveId(id)
  }, [])

  const moveWindow = useCallback((id: WindowId, x: number, y: number) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, x, y } : w))
    )
  }, [])

  const deactivateAll = useCallback(() => {
    setActiveId(null)
  }, [])

  const value = useMemo(
    () => ({
      windows,
      activeId,
      openWindow,
      closeWindow,
      minimizeWindow,
      toggleMaximize,
      focusWindow,
      moveWindow,
      deactivateAll,
    }),
    [
      windows,
      activeId,
      openWindow,
      closeWindow,
      minimizeWindow,
      toggleMaximize,
      focusWindow,
      moveWindow,
      deactivateAll,
    ]
  )

  return (
    <WindowManagerContext.Provider value={value}>
      {children}
    </WindowManagerContext.Provider>
  )
}
