"use client"

import { useState } from "react"
import { PROJECTS } from "@/lib/portfolio-data"

/** Repository-manager style projects window. */
export function ProjectsWindow() {
  const [selected, setSelected] = useState<string | null>(null)
  const project = PROJECTS.find((p) => p.name === selected)

  if (project) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setSelected(null)}
          className="text-xs font-mono text-accent hover:underline"
        >
          ← All repositories
        </button>
        <div>
          <div className="font-mono text-base font-semibold text-gh-green">
            {project.name}
          </div>
          <div className="text-muted-foreground/60 text-xs font-mono select-none">
            ────────────────────────────────────
          </div>
          <p className="mt-2 text-sm leading-relaxed text-foreground/70">
            {project.desc}
          </p>
        </div>
        <div>
          <h3 className="font-mono text-xs font-semibold tracking-wide text-gh-blue">
            TECHNOLOGIES
          </h3>
          <ul className="mt-1.5 space-y-0.5 text-sm text-foreground">
            {project.tech.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-mono text-xs font-semibold tracking-wide text-gh-blue">
            FEATURES
          </h3>
          <ul className="mt-1.5 space-y-1 text-sm text-foreground/80">
            {project.features.map((f) => (
              <li key={f} className="flex gap-2">
                <span className="text-gh-green">•</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-mono text-xs font-semibold tracking-wide text-gh-blue">
            LINKS
          </h3>
          <div className="mt-1.5 space-y-1 text-sm">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-2 text-accent hover:underline"
            >
              <span className="text-gh-green">→</span> Repository
            </a>
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-2 text-accent hover:underline"
              >
                <span className="text-gh-green">→</span> Live Demo
              </a>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <h2 className="font-mono text-xs font-semibold tracking-wide text-gh-blue mb-3">
        REPOSITORIES
      </h2>
      <div className="divide-y divide-border/50 rounded-sm border border-border bg-background/40">
        {PROJECTS.map((p) => (
          <button
            key={p.name}
            onClick={() => setSelected(p.name)}
            className="block w-full px-3 py-3 text-left hover:bg-secondary/40 transition-colors"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-sm font-semibold text-accent">
                {p.name}
              </span>
              <span className="text-xs text-muted-foreground">→</span>
            </div>
            <p className="mt-1 text-[13px] leading-snug text-muted-foreground">
              {p.desc}
            </p>
            <div className="mt-1.5 font-mono text-xs text-muted-foreground/70">
              {p.tech.join(" · ")}
            </div>
          </button>
        ))}
      </div>
      <p className="pt-2 text-xs text-muted-foreground">
        More on{" "}
        <a
          href="https://github.com/EGhesmati?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          GitHub
        </a>
        {" · "}
        <a href="/projects" className="text-accent hover:underline">
          Full page
        </a>
      </p>
    </div>
  )
}
