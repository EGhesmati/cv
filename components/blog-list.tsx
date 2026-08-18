"use client"

import { useState, useMemo } from "react"
import { SearchInput } from "@/components/search-input"
import { BlogCard } from "@/components/blog-card"
import { EmptyState } from "@/components/ui/state"
import type { PostMeta } from "@/types/post"

interface BlogListProps {
  posts: PostMeta[]
}

export function BlogList({ posts }: BlogListProps) {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    if (!query.trim()) return posts
    const q = query.toLowerCase()
    return posts.filter(
      (post) =>
        post.frontmatter.title.toLowerCase().includes(q) ||
        post.frontmatter.description.toLowerCase().includes(q) ||
        post.frontmatter.tags.some((tag) => tag.toLowerCase().includes(q))
    )
  }, [posts, query])

  return (
    <>
      <div className="mt-6">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search posts..."
        />
      </div>

      {query && (
        <p className="mt-3 text-xs text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "result" : "results"} for
          &ldquo;{query}&rdquo;
        </p>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          className="mt-12"
          title={query ? "No posts match your search" : "No posts yet"}
          description={query ? "Try another term or clear the query." : "Publish your first post to get started."}
        />
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {filtered.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </>
  )
}
