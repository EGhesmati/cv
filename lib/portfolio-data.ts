/**
 * Central, client-safe portfolio data.
 * Single source of truth shared by the terminal, window manager apps,
 * and (where applicable) mirrored by the route pages.
 */

export interface Project {
  name: string
  desc: string
  tech: string[]
  github: string
  features: string[]
  live: string | null
}

export const PROJECTS: Project[] = [
  {
    name: "MovieTracker",
    desc: "React app for discovering and tracking movies via the TMDB API",
    tech: ["React", "JavaScript", "TMDB API"],
    github: "https://github.com/EGhesmati/MovieTracker",
    features: [
      "Search and discover movies via the TMDB API",
      "Track watched and watchlist movies",
      "Responsive UI with detailed movie pages",
    ],
    live: null,
  },
  {
    name: "Notes",
    desc: "Minimalist notes app with search, dark/light mode, and clean UI",
    tech: ["React", "Vite", "Tailwind CSS"],
    github: "https://github.com/EGhesmati/Notes",
    features: [
      "Create, edit, and delete notes",
      "Full-text search across notes",
      "Dark/light mode with persistent preference",
    ],
    live: null,
  },
]

export const PROFILE = {
  name: "Erfan Ghesmati",
  role: "Full-Stack Developer",
  tagline: "Computer Engineering Student · Full-Stack Developer",
  bio: "Building modern web applications with React, Next.js, TypeScript, and Tailwind CSS.",
  location: "Turkey",
  site: "erfanghesmati.com",
  email: "erfanghesmati53@gmail.com",
  github: "https://github.com/EGhesmati",
  githubUser: "EGhesmati",
  linkedin: "https://www.linkedin.com/in/erfan-ghesmati-19b031225/",
  resumePdf:
    "https://www.dropbox.com/scl/fi/xxwn0irg4dhmvv5zpfb4h/Erfan_Ghesmati_Resume.pdf?rlkey=k4yrxbf9qgspn5pw5uphjawjy&st=ce3lt9jg&dl=0",
} as const

export const SKILLS: Array<{ category: string; items: string[] }> = [
  { category: "Languages", items: ["TypeScript", "JavaScript", "HTML5", "CSS3"] },
  { category: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "Vite"] },
  { category: "Backend", items: ["REST APIs", "Node.js", "Express.js"] },
  { category: "Tools", items: ["Git", "GitHub", "Docker", "npm", "VS Code"] },
]

export const EDUCATION = {
  degree: "B.Sc. Computer Engineering",
  school: "Manisa Celal Bayar University",
  period: "Expected 2027",
} as const

export interface BlogPostMeta {
  slug: string
  title: string
  date: string
  tags: string[]
}

/** Static index of posts (mirrors content/posts frontmatter) for the blog window. */
export const BLOG_POSTS: BlogPostMeta[] = [
  {
    slug: "building-clean-nextjs-portfolio",
    title: "Building a Clean Next.js Portfolio",
    date: "Jan 14",
    tags: ["Next.js", "Web Development"],
  },
  {
    slug: "getting-started-with-typescript",
    title: "Getting Started with TypeScript",
    date: "Jan 10",
    tags: ["TypeScript"],
  },
  {
    slug: "why-i-love-tailwind-css",
    title: "Why I Love Tailwind CSS",
    date: "Jan 5",
    tags: ["Tailwind CSS"],
  },
]

export const SUMMARY =
  "Software Engineer passionate about building beautiful, functional web applications. Focused on frontend development with React, Next.js, and the modern JavaScript ecosystem. I believe in writing clean, maintainable code and creating user experiences that are both delightful and accessible."

export const LANGUAGES = ["Persian", "Azerbaijani", "English", "Turkish"]
