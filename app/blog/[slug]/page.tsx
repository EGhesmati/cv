import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getAllPosts } from "@/lib/posts"
import { getRenderedPostsForSlug } from "@/lib/rendered-posts"
import { TerminalShell } from "@/components/terminal-shell"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const { post } = await getRenderedPostsForSlug(slug)

  if (!post) {
    return { title: "Post Not Found" }
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const { all, post } = await getRenderedPostsForSlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <section className="flex items-start justify-center py-5 sm:py-8">
      <div className="w-full max-w-4xl px-3 sm:px-6">
        <TerminalShell posts={all} initialCommand="blog" initialPostSlug={slug} />
      </div>
    </section>
  )
}
