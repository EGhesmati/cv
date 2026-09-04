import { getAllPosts, getPostBySlug } from "@/lib/posts"
import { markdownToHtml } from "@/lib/markdown"

/**
 * Server-only helper: builds the serializable `RenderedPost[]` payload that
 * the client `TerminalShell` consumes so the whole blog (list + reader) can
 * render inside the terminal application, with full markdown->HTML output
 * computed at build time.
 */
export async function getRenderedPosts(): Promise<
  Array<{
    slug: string
    title: string
    description: string
    date: string
    tags: string[]
    readingTime: number
    html: string
  }>
> {
  const posts = getAllPosts()
  const rendered = await Promise.all(
    posts.map(async (meta) => {
      const full = getPostBySlug(meta.slug)
      const html = full ? await markdownToHtml(full.content) : ""
      return {
        slug: meta.slug,
        title: meta.frontmatter.title,
        description: meta.frontmatter.description,
        date: meta.frontmatter.date,
        tags: meta.frontmatter.tags,
        readingTime: meta.readingTime,
        html,
      }
    })
  )
  // Sort newest first (getAllPosts already sorts, but be explicit)
  return rendered.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

/** Convenience: return the full rendered set plus a single post by slug. */
export async function getRenderedPostsForSlug(slug: string) {
  const all = await getRenderedPosts()
  const post = all.find((p) => p.slug === slug) ?? null
  return { all, post }
}
