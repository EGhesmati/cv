import type { ComponentType, SVGProps } from "react"
import {
  SiJavascript,
  SiTypescript,
  SiHtml5,
  SiCss,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiSpringboot,
  SiNodedotjs,
  SiExpress,
  SiGit,
  SiGithub,
  SiDocker,
  SiVite,
  SiNpm,
  SiIntellijidea,
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

/** Inline SVG for Java (not available in @icons-pack/react-simple-icons; SiOpenjdk is openjdk) */
function JavaIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M8.851 18.56s-.917.534.653.714c1.902.218 2.874.187 4.969-.212 0 0 .552.346 1.321.646-4.699 2.013-10.633-.118-6.943-1.149M8.276 15.933s-1.028.761.542.924c2.032.209 3.636.227 6.413-.308 0 0 .384.389.987.602-5.679 1.661-12.007.131-7.942-1.218M13.116 11.475c1.158 1.333-.304 2.533-.304 2.533s2.939-1.518 1.589-3.418c-1.261-1.772-2.228-2.652 3.007-5.688 0-.001-8.216 2.051-4.292 6.573M19.33 20.504s.679.559-.747.991c-2.712.822-11.288 1.069-13.669.033-.856-.373.75-.89 1.254-.998.527-.114.828-.093.828-.093-.953-.671-6.156 1.317-2.643 1.887 9.58 1.553 17.462-.7 14.977-1.82M9.292 13.21s-4.362 1.036-1.544 1.412c1.189.159 3.561.123 5.77-.062 1.808-.152 3.618-.477 3.618-.477s-.637.272-1.098.587c-4.429 1.165-12.986.623-10.522-.568 2.082-1.006 3.776-.892 3.776-.892M17.181 4.276c4.503 1.167-1.181 5.764-1.181 5.764s1.143-2.315-1.234-4.174C12.654 3.85 14.958 3.149 17.181 4.276" />
      <path d="M12.117 22s2.473.203 4.507-.394c0 0-.511.44-1.486.659-3.832.69-8.097.03-6.684-.609 1.332-.604 3.663-.344 3.663.344" />
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
      { name: "Java", icon: JavaIcon },
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
      { name: "Spring Boot", icon: SiSpringboot, learning: true },
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
      { name: "IntelliJ IDEA", icon: SiIntellijidea },
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
