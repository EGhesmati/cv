import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { Post, PostMeta } from "@/types/post"

const postsDirectory = path.join(process.cwd(), "content/posts")

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / wordsPerMinute))
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const posts = fileNames
    .filter((fileName) => fileName.endsWith(".md") || fileName.endsWith(".mdx"))
    .map((fileName) => {
      const slug = fileName.replace(/\.(md|mdx)$/, "")
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, "utf8")
      const { data, content } = matter(fileContents)

      return {
        slug,
        frontmatter: {
          title: data.title || slug,
          description: data.description || "",
          date: data.date
            ? new Date(data.date).toISOString().split("T")[0]
            : "1970-01-01",
          tags: data.tags || [],
        },
        readingTime: calculateReadingTime(content),
      }
    })
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    )

  return posts
}

export function getPostBySlug(slug: string): Post | null {
  const extensions = ["md", "mdx"]

  for (const ext of extensions) {
    const fullPath = path.join(postsDirectory, `${slug}.${ext}`)
    if (fs.existsSync(fullPath)) {
      const fileContents = fs.readFileSync(fullPath, "utf8")
      const { data, content } = matter(fileContents)

      return {
        slug,
        frontmatter: {
          title: data.title || slug,
          description: data.description || "",
          date: data.date
            ? new Date(data.date).toISOString().split("T")[0]
            : "1970-01-01",
          tags: data.tags || [],
        },
        content,
        readingTime: calculateReadingTime(content),
      }
    }
  }

  return null
}

export function getAllTags(): { tag: string; count: number }[] {
  const posts = getAllPosts()
  const tagMap = new Map<string, number>()

  for (const post of posts) {
    for (const tag of post.frontmatter.tags) {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
    }
  }

  return Array.from(tagMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
}

export function getPostsByTag(tag: string): PostMeta[] {
  const posts = getAllPosts()
  return posts.filter((post) =>
    post.frontmatter.tags
      .map((t) => t.toLowerCase())
      .includes(tag.toLowerCase())
  )
}
