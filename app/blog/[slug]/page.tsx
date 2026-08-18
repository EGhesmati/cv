import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getAllPosts, getPostBySlug } from "@/lib/posts"
import { markdownToHtml } from "@/lib/markdown"
import { PostHeader } from "@/components/post-header"
import { TableOfContents } from "@/components/toc"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

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
  const post = getPostBySlug(slug)

  if (!post) {
    return { title: "Post Not Found" }
  }

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      type: "article",
      publishedTime: post.frontmatter.date,
      tags: post.frontmatter.tags,
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const contentHtml = await markdownToHtml(post.content)
  const allPosts = getAllPosts()
  const currentIndex = allPosts.findIndex((p) => p.slug === slug)
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null

  return (
    <div className="section-wrap">
      <div className="layout-shell">
        <div className="flex gap-12">
          <article className="min-w-0 flex-1">
            <PostHeader post={post} />

            <div
              className="prose-custom"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />

            {/* Previous/Next navigation */}
            <nav className="mt-20 grid grid-cols-2 gap-4">
              {prevPost ? (
                <Link
                  href={`/blog/${prevPost.slug}`}
                  className="group flex flex-col rounded-sm border border-border/60 p-4 hover:border-border hover:bg-secondary/30 transition-all"
                >
                  <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                    <ChevronLeft className="size-3" />
                    Previous
                  </span>
                  <span className="mt-1.5 text-[14px] font-medium text-foreground group-hover:text-foreground transition-colors line-clamp-1">
                    {prevPost.frontmatter.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
              {nextPost ? (
                <Link
                  href={`/blog/${nextPost.slug}`}
                  className="group flex flex-col items-end rounded-sm border border-border/60 p-4 hover:border-border hover:bg-secondary/30 transition-all"
                >
                  <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                    Next
                    <ChevronRight className="size-3" />
                  </span>
                  <span className="mt-1.5 text-[14px] font-medium text-foreground group-hover:text-foreground transition-colors text-right line-clamp-1">
                    {nextPost.frontmatter.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
            </nav>
          </article>

          <TableOfContents />
        </div>
      </div>
    </div>
  )
}
