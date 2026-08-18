import { Skills } from "@/components/skills"

export function About() {
  return (
    <section className="section-wrap border-t border-border/50">
      <div className="layout-shell">
        <h2 className="font-heading text-3xl font-bold tracking-[-0.02em] text-foreground sm:text-4xl">
          About
        </h2>

        <div className="mt-6 max-w-2xl space-y-4 text-base leading-relaxed text-foreground/75">
          <p>
            I&apos;m a Software Engineer passionate about building
            beautiful, functional web applications. My focus is on frontend
            development with React and the modern JavaScript ecosystem.
          </p>
          <p>
            I believe in writing clean, maintainable code and creating user
            experiences that are both delightful and accessible. When I&apos;m not
            coding, I&apos;m exploring new technologies and improving my craft.
          </p>
        </div>

        <Skills />
      </div>
    </section>
  )
}
