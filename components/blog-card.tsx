import Link from "next/link"
import { PostMeta } from "@/types/post"

interface BlogCardProps {
  post: PostMeta
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block h-full border border-border bg-surface p-4 rounded-md hover:border-gh-blue/40 transition-colors no-underline"
    >
      <div className="mb-2 flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
        <span className="text-gh-green">→</span>
        <time dateTime={post.frontmatter.date}>
          {new Date(post.frontmatter.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </time>
        <span className="text-border">&middot;</span>
        <span>{post.readingTime} min read</span>
      </div>
      <h3 className="text-base font-semibold text-foreground transition-colors group-hover:text-gh-blue">
        {post.frontmatter.title}
      </h3>
      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-foreground/60">
        {post.frontmatter.description}
      </p>
      {post.frontmatter.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {post.frontmatter.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-sm border border-border bg-secondary px-2 py-0.5 font-mono text-[11px] font-semibold text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  )
}
