import { Loader2, Inbox, TriangleAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface StateProps {
  title: string
  description?: string
  className?: string
}

function LoadingState({ title = "Loading", description, className }: StateProps) {
  return (
    <div className={cn("rounded-sm border border-border bg-card p-8 text-center", className)}>
      <Loader2 className="mx-auto size-5 animate-spin text-muted-foreground" />
      <p className="mt-3 text-sm font-semibold text-foreground">{title}</p>
      {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
    </div>
  )
}

function EmptyState({ title, description, className }: StateProps) {
  return (
    <div className={cn("rounded-sm border border-border bg-card p-8 text-center", className)}>
      <Inbox className="mx-auto size-5 text-muted-foreground" />
      <p className="mt-3 text-sm font-semibold text-foreground">{title}</p>
      {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
    </div>
  )
}

interface ErrorStateProps extends StateProps {
  actionLabel?: string
  onAction?: () => void
}

function ErrorState({
  title,
  description,
  className,
  actionLabel,
  onAction,
}: ErrorStateProps) {
  return (
    <div className={cn("rounded-sm border border-destructive/30 bg-destructive/10 p-8 text-center", className)}>
      <TriangleAlert className="mx-auto size-5 text-destructive" />
      <p className="mt-3 text-sm font-semibold text-foreground">{title}</p>
      {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      {actionLabel && onAction ? (
        <Button className="mt-4" variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  )
}

export { LoadingState, EmptyState, ErrorState }
