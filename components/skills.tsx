import type { ComponentType, SVGProps } from "react"
import {
  SiJavascript,
  SiTypescript,
  SiHtml5,
  SiCss,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiNodedotjs,
  SiExpress,
  SiGit,
  SiGithub,
  SiDocker,
  SiVite,
  SiNpm,
} from "@icons-pack/react-simple-icons"
import { Globe } from "lucide-react"
import { Badge } from "@/components/ui/badge"

/** Inline SVG for VS Code (not available in @icons-pack/react-simple-icons) */
function VSCodeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z" />
    </svg>
  )
}

interface Skill {
  name: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  learning?: boolean
}

interface SkillCategory {
  title: string
  skills: Skill[]
}

const categories: SkillCategory[] = [
  {
    title: "Languages",
    skills: [
      { name: "JavaScript", icon: SiJavascript },
      { name: "TypeScript", icon: SiTypescript },
      { name: "HTML5", icon: SiHtml5 },
      { name: "CSS3", icon: SiCss },
    ],
  },
  {
    title: "Frontend",
    skills: [
      { name: "React", icon: SiReact },
      { name: "Next.js", icon: SiNextdotjs },
      { name: "Tailwind CSS", icon: SiTailwindcss },
      { name: "Vite", icon: SiVite },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "REST APIs", icon: Globe },
      { name: "Node.js", icon: SiNodedotjs },
      { name: "Express.js", icon: SiExpress },
    ],
  },

  {
    title: "Tools",
    skills: [
      { name: "Git", icon: SiGit },
      { name: "GitHub", icon: SiGithub },
      { name: "Docker", icon: SiDocker },
      { name: "npm", icon: SiNpm },
      { name: "VS Code", icon: VSCodeIcon },
    ],
  },
]

export function Skills() {
  return (
    <div className="mt-8 space-y-8">
      {categories.map((category) => (
        <div key={category.title}>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            {category.title}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {category.skills.map((skill) => (
              <div
                key={skill.name}
                className="group relative flex items-center gap-2.5 rounded-sm border border-border bg-card px-3 py-2.5 transition-colors hover:border-accent/40 hover:bg-secondary/60"
              >
                <skill.icon className="size-4 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors" />
                <span className="text-sm font-medium text-card-foreground truncate">
                  {skill.name}
                </span>
                {skill.learning && (
                  <Badge
                    variant="secondary"
                    className="ml-auto shrink-0 text-[10px] px-1.5 py-0 h-4 leading-none"
                  >
                    Learning
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
