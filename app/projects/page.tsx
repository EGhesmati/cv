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
