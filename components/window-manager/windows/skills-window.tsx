import { SKILLS } from "@/lib/portfolio-data"

/** Developer-information style skills window. */
export function SkillsWindow() {
  return (
    <div className="space-y-4">
      <h2 className="font-mono text-xs font-semibold tracking-wide text-gh-blue">
        CAPABILITIES
      </h2>
      <div className="space-y-3">
        {SKILLS.map((group) => (
          <div key={group.category}>
            <h3 className="font-mono text-sm font-semibold text-gh-green">
              {group.category}
            </h3>
            <p className="mt-1 text-sm text-foreground/85">
              {group.items.join(" · ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
