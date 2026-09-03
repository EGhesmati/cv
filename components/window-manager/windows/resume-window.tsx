import { Download, Globe, MapPin } from "lucide-react"
import { EDUCATION, LANGUAGES, PROFILE, SKILLS, SUMMARY } from "@/lib/portfolio-data"

/** Professional CV/document viewer window. */
export function ResumeWindow() {
  return (
    <div className="space-y-6">
      {/* Document header */}
      <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            {PROFILE.name}
          </h2>
          <p className="mt-0.5 text-sm text-foreground/60">{PROFILE.role}</p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3" /> {PROFILE.location}
            </span>
            <span className="inline-flex items-center gap-1">
              <Globe className="size-3" /> {PROFILE.site}
            </span>
          </div>
        </div>
        <a
          href={PROFILE.resumePdf}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-sm border border-gh-green/50 bg-gh-green/10 px-3 py-2 text-sm font-medium text-gh-green no-underline transition-colors hover:bg-gh-green/20"
        >
          <Download className="size-4" />
          Download PDF
        </a>
      </div>

      <section>
        <h3 className="font-mono text-xs font-semibold tracking-wide text-gh-blue">
          SUMMARY
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-foreground/75">
          {SUMMARY}
        </p>
      </section>

      <section>
        <h3 className="font-mono text-xs font-semibold tracking-wide text-gh-blue">
          SKILLS
        </h3>
        <dl className="mt-2 space-y-2.5">
          {SKILLS.map((group) => (
            <div key={group.category} className="flex gap-3 text-sm">
              <dt className="w-20 shrink-0 font-medium text-muted-foreground">
                {group.category}
              </dt>
              <dd className="text-foreground/85">{group.items.join(" · ")}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <h3 className="font-mono text-xs font-semibold tracking-wide text-gh-blue">
          EDUCATION
        </h3>
        <div className="mt-2 border-l-2 border-gh-green/40 pl-3 text-sm">
          <div className="font-semibold text-foreground">{EDUCATION.degree}</div>
          <div className="text-muted-foreground">
            {EDUCATION.school} · {EDUCATION.period}
          </div>
        </div>
      </section>

      <section>
        <h3 className="font-mono text-xs font-semibold tracking-wide text-gh-blue">
          LANGUAGES
        </h3>
        <p className="mt-2 text-sm text-foreground/85">{LANGUAGES.join(" · ")}</p>
      </section>

      <p className="border-t border-border pt-3 text-xs text-muted-foreground">
        <a href="/resume" className="text-accent hover:underline">
          Open full resume page →
        </a>
      </p>
    </div>
  )
}
