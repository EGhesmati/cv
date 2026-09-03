export type WindowId =
  | "projects"
  | "blog"
  | "resume"
  | "contact"
  | "about"
  | "skills"
  | "github"

export interface WindowState {
  id: WindowId
  title: string
  minimized: boolean
  maximized: boolean
  z: number
  /** Cascade position (px offsets within desktop area) */
  x: number
  y: number
}

export const WINDOW_TITLES: Record<WindowId, string> = {
  projects: "Projects — Repositories",
  blog: "Blog — Articles",
  resume: "Resume — Erfan Ghesmati.pdf",
  contact: "Contact",
  about: "About — System Info",
  skills: "Skills — Developer Info",
  github: "GitHub — EGhesmati",
}
