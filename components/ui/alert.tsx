import * as React from "react"
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

type AlertVariant = "info" | "success" | "warning" | "error"

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  variant?: AlertVariant
}

const iconByVariant: Record<AlertVariant, React.ComponentType<{ className?: string }>> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
}

const classByVariant: Record<AlertVariant, string> = {
  info: "border-accent/40 bg-accent/10 text-foreground",
  success: "border-success/40 bg-success/10 text-foreground",
  warning: "border-warning/50 bg-warning/20 text-warning-foreground",
  error: "border-destructive/40 bg-destructive/10 text-foreground",
}

function Alert({
  title,
  description,
  variant = "info",
  className,
  ...props
}: AlertProps) {
  const Icon = iconByVariant[variant]

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2.5 rounded-sm border p-3 text-sm",
        classByVariant[variant],
        className
      )}
      {...props}
    >
      <Icon className="mt-0.5 size-4 shrink-0" />
      <div>
        <p className="font-semibold">{title}</p>
        {description ? (
          <p className="mt-1 text-sm/relaxed opacity-90">{description}</p>
        ) : null}
      </div>
    </div>
  )
}

export { Alert }
