import Link from "next/link"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { PostMeta } from "@/types/post"

interface BlogCardProps {
  post: PostMeta
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="no-underline">
      <Card className="group h-full transition-colors hover:border-accent/40">
        <CardHeader>
          <div className="mb-1.5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
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
          <CardTitle className="text-lg tracking-[-0.01em] transition-colors group-hover:text-accent">
            {post.frontmatter.title}
          </CardTitle>
          <CardDescription className="line-clamp-2 text-sm leading-relaxed text-foreground/70">
            {post.frontmatter.description}
          </CardDescription>
          {post.frontmatter.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {post.frontmatter.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-sm border border-border bg-secondary px-2 py-0.5 text-[11px] font-semibold text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </CardHeader>
      </Card>
    </Link>
  )
}
