import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline" | "destructive" | "success" | "warning"
}

function Badge({ className, variant = "secondary", ...props }: BadgeProps) {
  const variants: Record<NonNullable<BadgeProps["variant"]>, string> = {
    default:
      "border-primary bg-primary text-primary-foreground",
    secondary:
      "border-border bg-secondary text-secondary-foreground",
    outline:
      "border-border text-foreground",
    destructive:
      "border-destructive/40 bg-destructive/10 text-destructive",
    success:
      "border-success/40 bg-success/15 text-success",
    warning:
      "border-warning/40 bg-warning/20 text-warning-foreground",
  }

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center justify-center rounded-sm border px-2 py-0.5 text-xs font-semibold whitespace-nowrap transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
