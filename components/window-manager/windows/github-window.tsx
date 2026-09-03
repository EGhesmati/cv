import { PROFILE, PROJECTS } from "@/lib/portfolio-data"

/** GitHub profile/repository style window. */
export function GithubWindow() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-gh-green/40 bg-gh-green/10 font-mono text-lg font-bold text-gh-green">
          EG
        </div>
        <div className="min-w-0">
          <div className="truncate font-mono text-sm font-semibold text-foreground">
            {PROFILE.githubUser}
          </div>
          <div className="text-xs text-muted-foreground">
            {PROFILE.name} · {PROFILE.role}
          </div>
        </div>
        <a
          href={PROFILE.github}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto shrink-0 rounded-sm border border-border px-2.5 py-1.5 text-xs font-medium text-foreground/80 no-underline transition-colors hover:bg-secondary"
        >
          Follow
        </a>
      </div>

      <div>
        <h3 className="font-mono text-xs font-semibold tracking-wide text-gh-blue">
          PINNED
        </h3>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {PROJECTS.map((p) => (
            <a
              key={p.name}
              href={p.github}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm border border-border bg-background/40 p-3 no-underline transition-colors hover:border-gh-green/40"
            >
              <div className="font-mono text-sm font-semibold text-accent">
                {p.name}
              </div>
              <p className="mt-1 line-clamp-2 text-xs leading-snug text-muted-foreground">
                {p.desc}
              </p>
              <div className="mt-2 font-mono text-[11px] text-muted-foreground/70">
                {p.tech[0]}
              </div>
            </a>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        <a
          href={PROFILE.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          github.com/{PROFILE.githubUser} →
        </a>
      </p>
    </div>
  )
}
