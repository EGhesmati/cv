import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPostsByTag, getAllTags } from "@/lib/posts"
import { getRenderedPosts } from "@/lib/rendered-posts"
import { getGitHubRepos } from "@/lib/github"
import { TerminalShell } from "@/components/terminal-shell"

interface PageProps {
  params: Promise<{ tag: string }>
}

export async function generateStaticParams() {
  const tags = getAllTags()
  return tags.map(({ tag }) => ({ tag }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { tag } = await params
  return {
    title: `Posts tagged "${decodeURIComponent(tag)}"`,
    description: `Blog posts tagged with "${decodeURIComponent(tag)}".`,
  }
}

export default async function TagPage({ params }: PageProps) {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)
  const posts = getPostsByTag(decodedTag)

  if (posts.length === 0) {
    notFound()
  }

  const [all, repos] = await Promise.all([getRenderedPosts(), getGitHubRepos()])

  return (
    <section className="flex items-start justify-center py-5 sm:py-8">
      <div className="w-full max-w-4xl px-3 sm:px-6">
        <TerminalShell posts={all} repos={repos} initialCommand="blog" />
      </div>
    </section>
  )
}
