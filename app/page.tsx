import { TerminalShell } from "@/components/terminal-shell"
import { getRenderedPosts } from "@/lib/rendered-posts"
import { getGitHubRepos } from "@/lib/github"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "erfan.dev — Developer Terminal",
  description:
    "Erfan Ghesmati — Computer Engineering Student & Full-Stack Developer. Explore projects, blog, resume, and contact through an interactive developer terminal.",
  openGraph: {
    title: "erfan.dev — Developer Terminal",
    description:
      "Computer Engineering Student & Full-Stack Developer",
    type: "website",
    locale: "en_US",
  },
}

export const revalidate = 3600

export default async function Home() {
  const [posts, repos] = await Promise.all([getRenderedPosts(), getGitHubRepos()])

  return (
    <section className="flex flex-1 min-h-0 items-center justify-center p-3 sm:p-6">
      <div className="flex h-full min-h-0 w-full max-w-4xl flex-col">
        <TerminalShell posts={posts} repos={repos} />
      </div>
    </section>
  )
}
