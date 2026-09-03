import type { Metadata } from "next"
import { getGitHubRepos } from "@/lib/github"
import { ProjectList } from "@/components/project-list"

export const metadata: Metadata = {
  title: "Projects",
  description: "Open-source projects from my GitHub profile.",
}

export default async function ProjectsPage() {
  const repos = await getGitHubRepos()

  return (
    <div className="section-wrap">
      <div className="layout-shell">
        <div className="font-mono text-sm text-muted-foreground mb-4">
          <span className="text-gh-green">erfan@dev</span>
          <span className="text-muted-foreground">:</span>
          <span className="text-gh-blue">~</span>
          <span className="text-foreground">$ </span>
          <span className="text-foreground">projects</span>
        </div>
        <h1 className="page-title">
          Projects
        </h1>
        <p className="page-lead">
          Open-source work from{" "}
          <a
            href="https://github.com/EGhesmati"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-accent"
          >
            GitHub
          </a>
          .
        </p>

        <ProjectList repos={repos} />
      </div>
    </div>
  )
}
