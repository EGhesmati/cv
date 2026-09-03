"use client"

import { useState, useMemo } from "react"
import { Star, ExternalLink } from "lucide-react"
import { SearchInput } from "@/components/search-input"
import { EmptyState } from "@/components/ui/state"
import type { GitHubRepo } from "@/types/github"

interface ProjectListProps {
  repos: GitHubRepo[]
}

const languageColors: Record<string, string> = {
  TypeScript: "bg-gh-blue",
  JavaScript: "bg-gh-orange",
  HTML: "bg-gh-orange",
  CSS: "bg-gh-purple",
  Java: "bg-gh-red",
  Python: "bg-gh-blue",
}

function LanguageDot({ language }: { language: string }) {
  const color = languageColors[language] || "bg-gh-gray"
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`inline-block size-3 rounded-full ${color}`} />
      <span>{language}</span>
    </span>
  )
}

export function ProjectList({ repos }: ProjectListProps) {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    if (!query.trim()) return repos
    const q = query.toLowerCase()
    return repos.filter(
      (repo) =>
        repo.name.toLowerCase().includes(q) ||
        (repo.description && repo.description.toLowerCase().includes(q)) ||
        (repo.language && repo.language.toLowerCase().includes(q)) ||
        repo.topics.some((topic) => topic.toLowerCase().includes(q))
    )
  }, [repos, query])

  if (repos.length === 0) {
    return (
      <EmptyState
        className="mt-12"
        title="No public repositories available"
        description="GitHub data could not be loaded right now."
      />
    )
  }

  return (
    <>
      <div className="mt-6 max-w-md">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search repositories..."
        />
      </div>

      {query && (
        <p className="mt-3 text-xs font-mono text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "result" : "results"} for
          &ldquo;{query}&rdquo;
        </p>
      )}

      {filtered.length === 0 ? (
        <EmptyState className="mt-12" title="No matching projects" description="Try another keyword or clear your search." />
      ) : (
        <div className="mt-6 divide-y divide-border rounded-md border border-border bg-surface">
          {filtered.map((repo) => (
            <div
              key={repo.id}
              className="p-4 hover:bg-secondary/40 transition-colors"
            >
              <div className="flex items-center justify-between gap-4">
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-sm font-semibold text-accent hover:underline underline-offset-4"
                >
                  {repo.name}
                </a>
                <span className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                  <Star className="size-3" />
                  {repo.stargazers_count}
                </span>
              </div>
              <p className="mt-1.5 text-[14px] leading-[1.6] text-muted-foreground">
                {repo.description || "No description provided."}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono text-muted-foreground">
                {repo.language && <LanguageDot language={repo.language} />}
                {repo.topics.slice(0, 5).map((topic) => (
                  <span key={topic} className="text-accent">
                    #{topic}
                  </span>
                ))}
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-foreground/50 hover:text-foreground transition-colors"
                >
                  <ExternalLink className="size-3" />
                  Code
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
