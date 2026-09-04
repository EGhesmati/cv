import { TerminalShell } from "@/components/terminal-shell"
import { getRenderedPosts } from "@/lib/rendered-posts"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts on web development, TypeScript, React, and more.",
}

export default async function BlogPage() {
  const posts = await getRenderedPosts()

  return (
    <section className="flex items-start justify-center py-5 sm:py-8">
      <div className="w-full max-w-4xl px-3 sm:px-6">
        <TerminalShell posts={posts} initialCommand="blog" />
      </div>
    </section>
  )
}
