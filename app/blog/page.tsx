import type { Metadata } from "next"
import { getAllPosts, getAllTags } from "@/lib/posts"
import { BlogList } from "@/components/blog-list"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts on web development, TypeScript, React, and more.",
}

export default function BlogPage() {
  const posts = getAllPosts()
  const tags = getAllTags()

  return (
    <div className="section-wrap">
      <div className="layout-shell">
        <h1 className="page-title">
          Blog
        </h1>
        <p className="page-lead">
          Thoughts on web development, TypeScript, React, and more.
        </p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-6">
            {tags.map(({ tag, count }) => (
              <Link key={tag} href={`/blog/tag/${encodeURIComponent(tag)}`}>
                <Badge variant="secondary" className="cursor-pointer text-xs hover:bg-secondary/80">
                  {tag}
                  <span className="ml-1 text-muted-foreground/60">({count})</span>
                </Badge>
              </Link>
            ))}
          </div>
        )}

        <BlogList posts={posts} />
      </div>
    </div>
  )
}
