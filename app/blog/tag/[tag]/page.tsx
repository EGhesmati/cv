import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPostsByTag, getAllTags } from "@/lib/posts"
import { BlogCard } from "@/components/blog-card"
import Link from "next/link"

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
    title: `Posts tagged "${tag}"`,
    description: `Blog posts tagged with "${tag}".`,
  }
}

export default async function TagPage({ params }: PageProps) {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)
  const posts = getPostsByTag(decodedTag)

  if (posts.length === 0) {
    notFound()
  }

  return (
    <div className="section-wrap">
      <div className="layout-shell">
        <Link
          href="/blog"
          className="text-xs font-semibold text-muted-foreground no-underline transition-colors hover:text-foreground"
        >
          &larr; Back to blog
        </Link>
        <h1 className="mt-4 font-heading text-3xl font-bold tracking-[-0.02em] text-foreground sm:text-4xl">
          Posts tagged &ldquo;{decodedTag}&rdquo;
        </h1>
        <p className="mt-2 text-sm text-foreground/55">
          {posts.length} post{posts.length !== 1 ? "s" : ""}
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </div>
  )
}
