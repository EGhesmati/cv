import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { ProjectsSection } from "@/components/projects-section"
import RecentPosts from "@/components/recent-posts"

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <ProjectsSection />
      <RecentPosts />
    </>
  )
}
