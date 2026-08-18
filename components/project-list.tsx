"use client"

import { useState, useMemo } from "react"
import { Star, ExternalLink } from "lucide-react"
import { SearchInput } from "@/components/search-input"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/ui/state"
import type { GitHubRepo } from "@/types/github"

interface ProjectListProps {
  repos: GitHubRepo[]
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
      <div className="mt-6">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search projects..."
        />
      </div>

      {query && (
        <p className="mt-3 text-xs text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "result" : "results"} for
          &ldquo;{query}&rdquo;
        </p>
      )}

      {filtered.length === 0 ? (
        <EmptyState className="mt-12" title="No matching projects" description="Try another keyword or clear your search." />
      ) : (
        <div className="mt-6 space-y-5">
          {filtered.map((repo) => (
            <Card key={repo.id} className="hover:border-accent/40">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <CardTitle className="text-lg font-semibold tracking-[-0.015em]">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="no-underline transition-colors hover:text-accent"
                    >
                      {repo.name}
                    </a>
                  </CardTitle>
                  {repo.stargazers_count > 0 && (
                    <span className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                      <Star className="size-3" />
                      {repo.stargazers_count}
                    </span>
                  )}
                </div>
                <CardDescription className="mt-2 text-[14px] leading-[1.65] text-foreground/60">
                  {repo.description || "No description provided."}
                </CardDescription>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  {repo.language && (
                    <Badge variant="secondary" className="text-[11px]">
                      {repo.language}
                    </Badge>
                  )}
                  {repo.topics.slice(0, 5).map((topic) => (
                    <Badge
                      key={topic}
                      variant="secondary"
                      className="text-[11px]"
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ExternalLink className="size-3" />
                  View on GitHub
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
