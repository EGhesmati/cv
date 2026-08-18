"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TabItem {
  value: string
  label: string
}

interface TabsProps {
  items: TabItem[]
  value: string
  onValueChange: (value: string) => void
  className?: string
}

function Tabs({ items, value, onValueChange, className }: TabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Tabs"
      className={cn(
        "inline-flex items-center gap-1 rounded-sm border border-border bg-muted p-1",
        className
      )}
    >
      {items.map((item) => {
        const selected = value === item.value
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={`tab-panel-${item.value}`}
            id={`tab-${item.value}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onValueChange(item.value)}
            className={cn(
              "rounded-[2px] px-3 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              selected
                ? "bg-background text-foreground shadow-[var(--shadow-sm)]"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}

interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  activeValue: string
}

function TabPanel({ value, activeValue, className, ...props }: TabPanelProps) {
  const hidden = value !== activeValue
  return (
    <div
      role="tabpanel"
      id={`tab-panel-${value}`}
      aria-labelledby={`tab-${value}`}
      hidden={hidden}
      className={cn("mt-4", className)}
      {...props}
    />
  )
}

export { Tabs, TabPanel }
