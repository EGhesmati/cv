import Link from "next/link"
import { ExternalLink } from "lucide-react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"

interface Project {
  title: string
  description: string
  github: string
}

const projects: Project[] = [
  {
    title: "MovieTracker",
    description:
      "A React application for discovering and tracking popular, top-rated, and upcoming movies using the TMDB API with dark mode support.",
    github: "https://github.com/EGhesmati/MovieTracker",
  },
  {
    title: "Notes",
    description:
      "A minimalist notes application built with React 19, Vite, and Tailwind CSS featuring search, dark/light mode, and a clean accessible interface.",
    github: "https://github.com/EGhesmati/Notes",
  },
]

export function ProjectsSection() {
  return (
    <section className="section-wrap border-t border-border/50">
      <div className="layout-shell">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-3xl font-bold tracking-[-0.02em] text-foreground sm:text-4xl">
            Projects
          </h2>
          <Link
            href="/projects"
            className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            View all &rarr;
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <Card key={project.title} className="group flex h-full flex-col hover:border-accent/40">
              <CardHeader>
                <CardTitle className="text-lg tracking-[-0.01em]">
                  {project.title}
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed text-foreground/70 line-clamp-3">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ExternalLink className="size-3" />
                  GitHub
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
