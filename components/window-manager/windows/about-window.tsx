import { PROFILE } from "@/lib/portfolio-data"

/** System-information style about window. */
export function AboutWindow() {
  const rows: Array<[string, string]> = [
    ["Name", PROFILE.name],
    ["Role", PROFILE.role],
    ["Focus", "Frontend · React · Modern JavaScript"],
    ["Stack", "React · Next.js · TypeScript · Tailwind CSS"],
    ["Location", PROFILE.location],
  ]

  return (
    <div className="space-y-4">
      <h2 className="font-mono text-xs font-semibold tracking-wide text-gh-blue">
        SYSTEM INFO
      </h2>
      <dl className="space-y-1.5 font-mono text-sm">
        {rows.map(([key, value]) => (
          <div key={key} className="flex gap-3">
            <dt className="w-20 shrink-0 text-gh-green">{key}</dt>
            <dd className="text-foreground">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="border-t border-border/50 pt-3 text-sm leading-relaxed text-foreground/70">
        Passionate about building beautiful, functional web applications with
        clean, maintainable code and delightful user experiences.
      </p>
    </div>
  )
}
