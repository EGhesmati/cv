import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface PaginationProps {
  currentPage: number
  totalPages: number
  createHref?: (page: number) => string
  onPageChange?: (page: number) => void
  className?: string
}

function Pagination({
  currentPage,
  totalPages,
  createHref,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const hasPrev = currentPage > 1
  const hasNext = currentPage < totalPages

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center justify-between gap-3", className)}
    >
      {hasPrev ? (
        onPageChange ? (
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            className="inline-flex h-10 items-center gap-1.5 rounded-sm border border-border px-3 text-sm font-semibold text-foreground hover:bg-secondary"
          >
            <ChevronLeft className="size-4" />
            Previous
          </button>
        ) : (
        <Link
          href={createHref ? createHref(currentPage - 1) : "#"}
          className="inline-flex h-10 items-center gap-1.5 rounded-sm border border-border px-3 text-sm font-semibold text-foreground no-underline hover:bg-secondary"
        >
          <ChevronLeft className="size-4" />
          Previous
        </Link>
        )
      ) : (
        <span className="inline-flex h-10 items-center rounded-sm border border-border px-3 text-sm text-muted-foreground">
          Previous
        </span>
      )}

      <p className="text-sm text-muted-foreground">
        Page <span className="font-semibold text-foreground">{currentPage}</span> of{" "}
        <span className="font-semibold text-foreground">{totalPages}</span>
      </p>

      {hasNext ? (
        onPageChange ? (
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            className="inline-flex h-10 items-center gap-1.5 rounded-sm border border-border px-3 text-sm font-semibold text-foreground hover:bg-secondary"
          >
            Next
            <ChevronRight className="size-4" />
          </button>
        ) : (
        <Link
          href={createHref ? createHref(currentPage + 1) : "#"}
          className="inline-flex h-10 items-center gap-1.5 rounded-sm border border-border px-3 text-sm font-semibold text-foreground no-underline hover:bg-secondary"
        >
          Next
          <ChevronRight className="size-4" />
        </Link>
        )
      ) : (
        <span className="inline-flex h-10 items-center rounded-sm border border-border px-3 text-sm text-muted-foreground">
          Next
        </span>
      )}
    </nav>
  )
}

export { Pagination }
