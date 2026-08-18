import * as React from "react"
import { cn } from "@/lib/utils"

interface RadioOption {
  value: string
  label: string
  description?: string
}

interface RadioGroupProps {
  name: string
  value?: string
  onChange: (value: string) => void
  options: RadioOption[]
  className?: string
}

function RadioGroup({ name, value, onChange, options, className }: RadioGroupProps) {
  return (
    <fieldset className={cn("space-y-2", className)}>
      {options.map((option) => {
        const id = `${name}-${option.value}`
        const isChecked = value === option.value

        return (
          <label key={option.value} htmlFor={id} className="flex cursor-pointer items-start gap-2.5">
            <span className="relative mt-0.5">
              <input
                id={id}
                type="radio"
                name={name}
                value={option.value}
                checked={isChecked}
                onChange={() => onChange(option.value)}
                className="peer sr-only"
              />
              <span className="flex size-4 items-center justify-center rounded-full border border-input bg-background ring-offset-background transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-checked:border-accent">
                <span className="size-2 rounded-full bg-accent opacity-0 transition-opacity peer-checked:opacity-100" />
              </span>
            </span>
            <span>
              <span className="block text-sm font-medium text-foreground">{option.label}</span>
              {option.description ? (
                <span className="block text-xs text-muted-foreground">{option.description}</span>
              ) : null}
            </span>
          </label>
        )
      })}
    </fieldset>
  )
}

export { RadioGroup }
