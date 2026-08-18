import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "secondary" | "destructive" | "link"
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-xs"
}

const buttonBaseStyles =
  "inline-flex items-center justify-center gap-1.5 rounded-sm border text-sm font-semibold whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50"

export function buttonVariants({
  variant = "default",
  size = "default",
  className,
}: {
  variant?: ButtonProps["variant"]
  size?: ButtonProps["size"]
  className?: string
} = {}) {
  const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
    default:
      "border-primary bg-primary text-primary-foreground hover:bg-primary/90",
    outline:
      "border-border bg-background text-foreground hover:bg-secondary",
    secondary:
      "border-border bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost:
      "border-transparent text-foreground hover:bg-secondary",
    destructive:
      "border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20",
    link:
      "border-transparent text-accent underline-offset-4 hover:underline",
  }

  const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
    default: "h-10 px-4 [&_svg]:size-4",
    sm: "h-8 rounded-sm px-3 text-xs [&_svg]:size-3.5",
    lg: "h-11 px-6 [&_svg]:size-5",
    icon: "size-10 [&_svg]:size-4",
    "icon-sm": "size-8 [&_svg]:size-3.5",
    "icon-xs": "size-7 [&_svg]:size-3",
  }

  return cn(buttonBaseStyles, variantStyles[variant], sizeStyles[size], className)
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
