import Link from "next/link"
import { BLOG_POSTS } from "@/lib/portfolio-data"

/** Documentation-style blog index window. */
export function BlogWindow() {
  return (
    <div className="space-y-3">
      <div>
        <h2 className="font-mono text-xs font-semibold tracking-wide text-gh-blue">
          ARTICLES
        </h2>
        <p className="mt-1 text-sm text-foreground/70">
          Technical writing about web development.
        </p>
      </div>
      <div className="divide-y divide-border/50 rounded-sm border border-border bg-background/40">
        {BLOG_POSTS.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block px-3 py-3 no-underline hover:bg-secondary/40 transition-colors"
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-medium text-accent">
                {post.title}
              </span>
              <span className="shrink-0 font-mono text-xs text-muted-foreground">
                {post.date}
              </span>
            </div>
            <div className="mt-1 flex flex-wrap gap-x-3 font-mono text-xs text-muted-foreground/70">
              {post.tags.map((t) => (
                <span key={t}>#{t.replace(/\s+/g, "-").toLowerCase()}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        <Link href="/blog" className="text-accent hover:underline">
          Open full blog →
        </Link>
      </p>
    </div>
  )
}
