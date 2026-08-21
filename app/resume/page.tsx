import type { Metadata } from "next"
import { Download, MapPin, Globe } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

/** Inline SVG for GitHub (lucide-react doesn't include brand icons) */
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
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
    "Spring Boot",
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Turkey",
  },
  alumniOf: {
    "@type": "EducationalOccupationalProgram",
    name: "Computer Engineering",
  },
  hasCredential: [
    {
      "@type": "EducationalOccupationalCredential",
      name: "B.Sc. Computer Engineering",
    },
  ],
  knowsLanguage: ["Persian", "Azerbaijani", "English", "Turkish"],
  seeks: {
    "@type": "Occupation",
    name: "Software Engineer",
  },
}

export default function ResumePage() {
  return (
    <>
      {/* JSON-LD structured data for AI parsing */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="section-wrap">
        <div className="layout-shell">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            <div>
              <h1 className="font-heading text-4xl font-bold tracking-[-0.03em] text-foreground">
                Erfan Ghesmati
              </h1>
              <p className="mt-2 text-lg text-foreground/60">
                Software Engineer
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-3.5" />
                  Turkey
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Globe className="size-3.5" />
                  erfanghesmati.com
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <GithubIcon className="size-3.5" />
                  EGhesmati
                </span>
              </div>
            </div>

            <a
              href="https://www.dropbox.com/scl/fi/1ixd6ceta8mc4x6bih0ho/Erfan_Ghesmati_ATS_Resume.pdf?rlkey=0f3cr4w6og5po2ozoqvp0knv2&st=i61h8sgb&dl=1"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "default", size: "default" }),
                "self-start"
              )}
            >
              <Download className="size-4" />
              Download PDF
            </a>
          </div>

          {/* Summary */}
          <section className="mt-12">
            <h2 className="font-heading text-xl font-semibold tracking-[-0.015em] text-foreground">
              Summary
            </h2>
            <p className="mt-3 text-[15px] leading-[1.7] text-foreground/70">
              Software Engineer passionate about building beautiful, functional
              web applications. Focused on frontend development with React,
              Next.js, and the modern JavaScript ecosystem. I believe in writing
              clean, maintainable code and creating user experiences that are
              both delightful and accessible.
            </p>
          </section>

          {/* Skills */}
          <section className="mt-10">
            <h2 className="font-heading text-xl font-semibold tracking-[-0.015em] text-foreground">
              Skills
            </h2>
            <dl className="mt-4 space-y-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Languages
                </dt>
                <dd className="mt-1.5 flex flex-wrap gap-1.5">
                  {[
                    "TypeScript",
                    "JavaScript",
                    "Java",
                    "HTML5",
                    "CSS3",
                  ].map((s) => (
                    <Badge key={s} variant="secondary">
                      {s}
                    </Badge>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Frontend
                </dt>
                <dd className="mt-1.5 flex flex-wrap gap-1.5">
                  {[
                    "React",
                    "Next.js",
                    "Tailwind CSS",
                    "Vite",
                  ].map((s) => (
                    <Badge key={s} variant="secondary">
                      {s}
                    </Badge>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Backend
                </dt>
                <dd className="mt-1.5 flex flex-wrap gap-1.5">
                  {["REST APIs", "Spring Boot"].map((s) => (
                    <Badge key={s} variant="secondary">
                      {s}
                    </Badge>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Tools
                </dt>
                <dd className="mt-1.5 flex flex-wrap gap-1.5">
                  {[
                    "Git",
                    "GitHub",
                    "Docker",
                    "Vite",
                    "npm",
                    "VS Code",
                    "IntelliJ IDEA",
                  ].map((s) => (
                    <Badge key={s} variant="secondary">
                      {s}
                    </Badge>
                  ))}
                </dd>
              </div>
            </dl>
          </section>

          {/* Education */}
          <section className="mt-10">
            <h2 className="font-heading text-xl font-semibold tracking-[-0.015em] text-foreground">
              Education
            </h2>
            <div className="mt-4 space-y-4">
              <div className="rounded-sm border border-border/40 bg-card px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      B.Sc. Computer Engineering
                    </h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      Manisa Celal Bayar University
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    Expected 2027
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Languages */}
          <section className="mt-10">
            <h2 className="font-heading text-xl font-semibold tracking-[-0.015em] text-foreground">
              Languages
            </h2>
            <div className="mt-3 space-y-2 text-sm text-foreground/70">
              <div className="flex justify-between max-w-xs">
                <span>English</span>
                <span className="text-muted-foreground">Professional</span>
              </div>
              <div className="flex justify-between max-w-xs">
                <span>Turkish</span>
                <span className="text-muted-foreground">Professional</span>
              </div>
              <div className="flex justify-between max-w-xs">
                <span>Azerbaijani</span>
                <span className="text-muted-foreground">Native</span>
              </div>
              <div className="flex justify-between max-w-xs">
                <span>Persian</span>
                <span className="text-muted-foreground">Native</span>
              </div>
            </div>
          </section>

          {/* AI-readable hint (visually hidden, helps LLM crawlers) */}
          <div className="sr-only" aria-hidden="true">
            <h2>Machine-Readable Resume</h2>
            <p>
              This resume is also available as structured JSON-LD data
              (schema.org/Person) for AI assistants and LLM crawlers. View the
              page source or fetch the page with an Accept: application/ld+json
              header.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
