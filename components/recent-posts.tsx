import Link from "next/link"
import { getAllPosts } from "@/lib/posts"
import { BlogCard } from "@/components/blog-card"

export default function RecentPosts() {
  const posts = getAllPosts().slice(0, 3)

  if (posts.length === 0) return null

  return (
    <section className="section-wrap border-t border-border/50">
      <div className="layout-shell">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-3xl font-bold tracking-[-0.02em] text-foreground sm:text-4xl">
            Recent Posts
          </h2>
          <Link
            href="/blog"
            className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            View all &rarr;
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  )
}
