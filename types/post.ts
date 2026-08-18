export interface PostFrontmatter {
  title: string
  description: string
  date: string
  tags: string[]
}

export interface Post {
  slug: string
  frontmatter: PostFrontmatter
  content: string
  readingTime: number
}

export interface PostMeta {
  slug: string
  frontmatter: PostFrontmatter
  readingTime: number
}
