import { TerminalShell } from "@/components/terminal-shell"
import { getRenderedPosts } from "@/lib/rendered-posts"
import { getGitHubRepos } from "@/lib/github"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts on web development, TypeScript, React, and more.",
}

export const revalidate = 3600

export default async function BlogPage() {
  const [posts, repos] = await Promise.all([getRenderedPosts(), getGitHubRepos()])

  return (
    <section className="flex items-start justify-center py-5 sm:py-8">
      <div className="w-full max-w-4xl px-3 sm:px-6">
        <TerminalShell posts={posts} repos={repos} initialCommand="blog" />
      </div>
    </section>
  )
}
