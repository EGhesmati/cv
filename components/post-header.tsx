import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Post } from "@/types/post"

interface PostHeaderProps {
  post: Post
}

export function PostHeader({ post }: PostHeaderProps) {
  return (
    <header className="mb-10">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] leading-[1.15] text-foreground">
        {post.frontmatter.title}
      </h1>
      <p className="mt-3 text-base text-foreground/60 leading-relaxed">
        {post.frontmatter.description}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-[13px] text-muted-foreground">
        <time dateTime={post.frontmatter.date}>
          {new Date(post.frontmatter.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <span className="text-border">&middot;</span>
        <span>{post.readingTime} min read</span>
      </div>
      {post.frontmatter.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {post.frontmatter.tags.map((tag) => (
            <Link key={tag} href={`/blog/tag/${encodeURIComponent(tag)}`}>
              <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80 text-xs">
                {tag}
              </Badge>
            </Link>
          ))}
        </div>
      )}
      <Separator className="mt-8" />
    </header>
  )
}
