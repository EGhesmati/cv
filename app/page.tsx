import { TerminalShell } from "@/components/terminal-shell"
import { getRenderedPosts } from "@/lib/rendered-posts"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "erfan.dev — Developer Terminal",
  description:
    "Erfan Ghesmati — Computer Engineering Student & Full-Stack Developer. Explore projects, blog, resume, and contact through an interactive developer terminal.",
  openGraph: {
    title: "erfan.dev — Developer Terminal",
    description:
      "Computer Engineering Student & Full-Stack Developer",
    type: "website",
    locale: "en_US",
  },
}

export default async function Home() {
  const posts = await getRenderedPosts()

  return (
    <section className="flex items-start justify-center py-5 sm:py-8">
      <div className="w-full max-w-4xl px-3 sm:px-6">
        <TerminalShell posts={posts} />
      </div>
    </section>
  )
}
