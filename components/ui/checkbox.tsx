import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string
  description?: string
}

function Checkbox({ className, label, description, id, ...props }: CheckboxProps) {
  const inputId = id ?? `checkbox-${label.toLowerCase().replace(/\s+/g, "-")}`

  return (
    <label htmlFor={inputId} className={cn("flex cursor-pointer items-start gap-2.5", className)}>
      <span className="relative mt-0.5">
        <input
          id={inputId}
          type="checkbox"
          className="peer sr-only"
          {...props}
        />
        <span className="flex size-4 items-center justify-center rounded-[2px] border border-input bg-background text-accent opacity-100 ring-offset-background transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-disabled:opacity-50 peer-checked:border-accent peer-checked:bg-accent peer-checked:text-accent-foreground">
          <Check className="size-3 opacity-0 transition-opacity peer-checked:opacity-100" />
        </span>
      </span>
      <span>
        <span className="block text-sm font-medium text-foreground">{label}</span>
        {description ? (
          <span className="block text-xs text-muted-foreground">{description}</span>
        ) : null}
      </span>
    </label>
  )
}

export { Checkbox }
