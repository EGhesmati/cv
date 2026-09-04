import { TerminalShell } from "@/components/terminal-shell"
import { getRenderedPosts } from "@/lib/rendered-posts"
import type { Metadata } from "next"

/** JSON-LD structured data for AI/LLM crawlability (schema.org/Person) */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Erfan Ghesmati",
  givenName: "Erfan",
  familyName: "Ghesmati",
  jobTitle: "Software Engineer",
  description:
    "Software Engineer passionate about building beautiful, functional web applications with React, Next.js, TypeScript, and Tailwind CSS.",
  url: "https://erfanghesmati.com",
  sameAs: [
    "https://github.com/EGhesmati",
    "https://linkedin.com/in/erfanghesmati",
  ],
  knowsAbout: [
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Tailwind CSS",
    "HTML5",
    "CSS3",
    "Git",
    "Docker",
    "REST APIs",
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Turkey",
  },
  alumniOf: {
    "@type": "EducationalOccupationalProgram",
    name: "Computer Engineering",
  },
  knowsLanguage: ["Persian", "Azerbaijani", "English", "Turkish"],
  seeks: {
    "@type": "Occupation",
    name: "Software Engineer",
  },
}

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Resume of Erfan Ghesmati — Software Engineer based in Turkey. Downloadable PDF and AI-readable structured resume.",
  openGraph: {
    title: "Resume — Erfan Ghesmati",
    description:
      "Software Engineer. React, Next.js, TypeScript, Tailwind CSS.",
    type: "profile",
  },
}

export default async function ResumePage() {
  const posts = await getRenderedPosts()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="flex items-start justify-center py-5 sm:py-8">
        <div className="w-full max-w-4xl px-3 sm:px-6">
          <TerminalShell posts={posts} initialCommand="resume" />
        </div>
      </section>
    </>
  )
}
