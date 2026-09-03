"use client"

import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className,
}: SearchInputProps) {
  return (
    <div className={cn("relative font-mono", className)}>
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gh-green text-sm pointer-events-none select-none">
        $
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-9 rounded-sm border border-border/60 bg-secondary/30 pl-7 pr-8 font-mono text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 size-5 inline-flex items-center justify-center rounded text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  )
}
