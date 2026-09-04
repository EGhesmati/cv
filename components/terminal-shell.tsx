"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react"
import {
  EDUCATION,
  LANGUAGES,
  PROFILE,
  SKILLS,
  SUMMARY,
} from "@/lib/portfolio-data"
import type { GitHubRepo } from "@/types/github"
import { cn } from "@/lib/utils"
import { registerTerminalHandler, setTerminalView } from "@/lib/terminal-commands"

/* ══════════════════════════════════════════════
   Types
   ══════════════════════════════════════════════ */

export interface RenderedPost {
  slug: string
  title: string
  description: string
  date: string
  tags: string[]
  readingTime: number
  html: string
}

type Screen =
  | { id: "home" }
  | { id: "about" }
  | { id: "skills" }
  | { id: "projects"; selected: string | null }
  | { id: "blog"; selectedSlug: string | null }
  | { id: "resume" }
  | { id: "contact" }
  | { id: "github" }

interface LogEntry {
  id: number
  kind: "cmd" | "msg"
  text?: string
  node?: ReactNode
  error?: boolean
}

const PROMPT_USER = "erfan"
const PROMPT_HOST = "dev"
const PROMPT_CWD = "~"

const COMMAND_ALIASES: Record<string, string> = {
  "~": "home",
  home: "home",
  cd: "home",
  help: "help",
  about: "about",
  skills: "skills",
  projects: "projects",
  resume: "resume",
  blog: "blog",
  contact: "contact",
  github: "github",
  clear: "clear",
  history: "history",
  whoami: "whoami",
  neofetch: "neofetch",
  ls: "ls",
  cat: "cat",
  pwd: "pwd",
  echo: "echo",
  git: "git",
  repo: "repo",
  open: "open",
  back: "back",
}

interface TerminalShellProps {
  /** Command to auto-run on mount (e.g. "projects", "blog"). Defaults to home. */
  initialCommand?: string
  /** Slug to open directly (for /blog/[slug] routes). */
  initialPostSlug?: string
  /** Server-rendered HTML for every post (enables in-terminal reading). */
  posts: RenderedPost[]
  /** Server-fetched public GitHub repos (shown in the projects view). */
  repos?: GitHubRepo[]
}

function formatDate(date: string): string {
  if (!date) return ""
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return date
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

/* ── prompt ─────────────────────────────────── */
function Prompt() {
  return (
    <span className="whitespace-nowrap">
      <span className="text-gh-green">{PROMPT_USER}</span>
      <span className="text-foreground/60">@</span>
      <span className="text-gh-blue">{PROMPT_HOST}</span>
      <span className="text-foreground/60">:</span>
      <span className="text-gh-blue">{PROMPT_CWD}</span>
      <span className="text-foreground">$</span>
    </span>
  )
}

/* ══════════════════════════════════════════════
   Screen renderers
   ══════════════════════════════════════════════ */

function TerminalTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-gh-blue sm:text-xs">
      {children}
    </div>
  )
}

function Row({ k, v }: { k: string; v: ReactNode }) {
  return (
    <div className="flex gap-2">
      <span className="w-24 shrink-0 text-gh-green sm:w-28">{k}</span>
      <span className="min-w-0 text-foreground">{v}</span>
    </div>
  )
}

function HomeScreen({ open }: { open: (id: Screen["id"]) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-bold text-foreground sm:text-3xl">
          Erfan Ghesmati
        </div>
        <div className="mt-1 text-sm text-foreground/70">
          {PROFILE.role} <span className="text-gh-green">|</span>{" "}
          Computer Engineering Student
        </div>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground/70">
          {PROFILE.bio} This is my developer terminal — type a command below or
          click a suggestion to explore.
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {[
          { id: "about" as const, label: "about", desc: "Profile & bio" },
          { id: "projects" as const, label: "projects", desc: "Repositories" },
          { id: "blog" as const, label: "blog", desc: "Articles" },
          { id: "resume" as const, label: "resume", desc: "CV / resume" },
          { id: "skills" as const, label: "skills", desc: "Tech stack" },
          { id: "contact" as const, label: "contact", desc: "Reach me" },
        ].map((c) => (
          <button
            key={c.id}
            onClick={() => open(c.id)}
            className="group flex items-center justify-between gap-3 rounded-sm border border-border bg-secondary/30 px-3 py-2.5 text-left transition-colors hover:border-gh-green/40 hover:bg-secondary/50"
          >
            <span className="font-mono text-xs text-gh-green sm:text-sm">
              $ {c.label}
            </span>
            <span className="text-xs text-muted-foreground">{c.desc}</span>
          </button>
        ))}
      </div>

      <div className="text-xs text-muted-foreground">
        <span className="text-gh-green">Tip:</span> press{" "}
        <span className="text-foreground/80">Tab</span> to autocomplete,{" "}
        <span className="text-foreground/80">↑</span>/
        <span className="text-foreground/80">↓</span> for history,{" "}
        <span className="text-foreground/80">Ctrl+K</span> to focus input.
      </div>
    </div>
  )
}

function AboutScreen() {
  const rows: Array<[string, ReactNode]> = [
    ["Name", PROFILE.name],
    ["Role", PROFILE.role],
    ["Status", "Computer Engineering Student"],
    ["Focus", "Frontend · React · Modern JavaScript"],
    ["Stack", "React · Next.js · TypeScript · Tailwind CSS"],
    ["Location", PROFILE.location],
  ]
  return (
    <div className="space-y-4">
      <TerminalTitle>about — system info</TerminalTitle>
      <div className="space-y-1 text-sm">
        {rows.map(([k, v]) => (
          <Row key={k} k={k} v={v} />
        ))}
      </div>
      <p className="border-t border-border/60 pt-3 text-sm leading-relaxed text-foreground/70">
        {SUMMARY}
      </p>
      <p className="text-xs text-muted-foreground">
        Run <span className="text-gh-green">git log</span> for recent commit
        history or <span className="text-gh-green">neofetch</span> for a system
        snapshot.
      </p>
    </div>
  )
}

function SkillsScreen() {
  return (
    <div className="space-y-5">
      <TerminalTitle>skills — capabilities</TerminalTitle>
      <div className="space-y-5 text-sm">
        {SKILLS.map((group) => (
          <div key={group.category}>
            <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-gh-green">
              {group.category}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-foreground/90">
              {group.items.map((item, idx) => (
                <span key={item}>
                  {item}
                  {idx < group.items.length - 1 && (
                    <span className="ml-0.5 text-gh-green/40">·</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function RepoDetail({ repo, onBack }: { repo: GitHubRepo; onBack: () => void }) {
  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="rounded-sm font-mono text-xs text-accent transition-colors hover:underline"
      >
        ← All repositories
      </button>
      <div>
        <div className="text-base font-semibold text-gh-green sm:text-lg">
          {repo.name}
        </div>
        <div className="select-none text-[11px] text-foreground/40">
          ────────────────────────────────────
        </div>
      </div>
      <p className="text-sm leading-relaxed text-foreground/75">
        {repo.description || "No description provided."}
      </p>

      <div>
        <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-gh-blue">
          Meta
        </div>
        <ul className="space-y-0.5 text-sm text-foreground">
          <li>· Language: {repo.language || "—"}</li>
          <li>· Stars: {repo.stargazers_count}</li>
          <li>· Updated: {formatDate(repo.updated_at)}</li>
        </ul>
      </div>

      {repo.topics.length > 0 && (
        <div>
          <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-gh-blue">
            Topics
          </div>
          <div className="flex flex-wrap gap-1.5">
            {repo.topics.map((t) => (
              <span
                key={t}
                className="rounded-sm border border-border bg-secondary/40 px-2 py-0.5 font-mono text-[11px] text-foreground/70"
              >
                #{t}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-1 text-sm">
        <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-gh-blue">
          Links
        </div>
        <div className="flex gap-2">
          <span className="text-gh-green">→</span>
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Repository
          </a>
        </div>
        <div className="flex gap-2">
          <span className="text-gh-green">→</span>
          <button
            onClick={onBack}
            className="cursor-pointer text-accent hover:underline"
          >
            Back to all
          </button>
        </div>
      </div>
    </div>
  )
}

function ProjectsScreen({
  repos,
  selected,
  onSelect,
  onBack,
}: {
  repos: GitHubRepo[]
  selected: string | null
  onSelect: (name: string) => void
  onBack: () => void
}) {
  if (selected) {
    const repo = repos.find((r) => r.name === selected)
    if (!repo) {
      return (
        <div className="text-gh-red">Repository not found: {selected}.</div>
      )
    }
    return <RepoDetail repo={repo} onBack={onBack} />
  }

  return (
    <div className="space-y-4">
      <TerminalTitle>projects — {repos.length} repositories</TerminalTitle>
      <div className="space-y-2">
        {repos.map((r) => (
          <button
            key={r.id}
            onClick={() => onSelect(r.name)}
            className="group w-full rounded-sm border border-border bg-secondary/30 px-3 py-3 text-left transition-colors hover:border-gh-green/40 hover:bg-secondary/50"
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-mono text-sm font-semibold text-gh-green">
                {r.name}
              </span>
              <span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                {r.language && <span className="hidden sm:inline">{r.language}</span>}
                {r.stargazers_count > 0 && <span>★ {r.stargazers_count}</span>}
                <span>→</span>
              </span>
            </div>
            {r.description && (
              <p className="mt-1 text-[13px] leading-snug text-foreground/70">
                {r.description}
              </p>
            )}
            {r.topics.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1 font-mono text-[11px] text-foreground/50">
                {r.topics.slice(0, 4).map((t) => (
                  <span key={t}>#{t}</span>
                ))}
              </div>
            )}
          </button>
        ))}
      </div>
      {repos.length === 0 && (
        <p className="text-sm text-foreground/60">
          No public repositories found.
        </p>
      )}
      <p className="pt-1 text-xs text-muted-foreground">
        Shown live from{" "}
        <a
          href={PROFILE.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          github.com/{PROFILE.githubUser}
        </a>
      </p>
    </div>
  )
}

function BlogIndex({ posts, onOpen }: { posts: RenderedPost[]; onOpen: (slug: string) => void }) {
  return (
    <div className="space-y-4">
      <TerminalTitle>blog — technical writing</TerminalTitle>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">
        <span>Title</span>
        <span className="float-right hidden sm:inline">Date · Read time</span>
      </div>
      <div className="divide-y divide-border/60">
        {posts.map((post, i) => (
          <button
            key={post.slug}
            onClick={() => onOpen(post.slug)}
            className="group flex w-full items-baseline justify-between gap-4 py-3 text-left transition-colors hover:bg-secondary/40"
          >
            <span className="flex items-baseline gap-3">
              <span className="w-6 shrink-0 font-mono text-xs text-foreground/40">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-mono text-sm text-accent group-hover:underline">
                {post.title}
              </span>
            </span>
            <span className="hidden shrink-0 whitespace-nowrap text-xs text-foreground/50 sm:inline">
              {formatDate(post.date)} · {post.readingTime} min
            </span>
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Select a post to read it here, or run{" "}
        <span className="text-gh-green">blog &lt;slug&gt;</span>.
      </p>
    </div>
  )
}

function PostScreen({
  post,
  posts,
  onBack,
  onPrev,
  onNext,
}: {
  post: RenderedPost
  posts: RenderedPost[]
  onBack: () => void
  onPrev: (() => void) | null
  onNext: (() => void) | null
}) {
  const bodyRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  const handleScroll = useCallback(() => {
    const el = bodyRef.current
    if (!el) return
    const max = el.scrollHeight - el.clientHeight
    if (max <= 0) {
      setProgress(0)
      return
    }
    setProgress(Math.min(1, Math.max(0, el.scrollTop / max)))
  }, [])

  const index = posts.findIndex((p) => p.slug === post.slug)
  const prev = index < posts.length - 1 ? posts[index + 1] : null
  const next = index > 0 ? posts[index - 1] : null

  return (
    <div className="space-y-4">
      {/* Reading progress */}
      <div
        aria-hidden="true"
        className="line relative h-0.5 w-full overflow-hidden rounded-full bg-border/40"
      >
        <div
          className="absolute inset-y-0 left-0 bg-gh-green"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>

      <button
        onClick={onBack}
        className="rounded-sm font-mono text-xs text-accent transition-colors hover:underline"
      >
        ← Back to blog
      </button>

      <header className="space-y-3">
        <h1 className="text-xl font-bold leading-[1.2] tracking-[-0.02em] text-foreground sm:text-2xl">
          {post.title}
        </h1>
        <p className="text-sm leading-relaxed text-foreground/60">
          {post.description}
        </p>
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-foreground/50">
          <span>{formatDate(post.date)}</span>
          <span>·</span>
          <span>{post.readingTime} min read</span>
          {post.tags.map((t) => (
            <span key={t} className="rounded-sm bg-secondary px-1.5 py-0.5 text-[11px] text-accent">
              #{t.replace(/\s+/g, "-").toLowerCase()}
            </span>
          ))}
        </div>
      </header>

      <div
        ref={bodyRef}
        onScroll={handleScroll}
        className="prose-custom -mx-1 max-h-96 overflow-y-auto px-1"
      >
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
      </div>

      <nav className="grid grid-cols-2 gap-3 border-t border-border/60 pt-3">
        {prev ? (
          <button
            onClick={onPrev ?? undefined}
            className="group flex flex-col items-start gap-1 rounded-sm border border-border/60 p-3 text-left transition-colors hover:border-border hover:bg-secondary/40"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-foreground/50">
              ← Prev
            </span>
            <span className="line-clamp-1 text-[13px] font-medium text-foreground">
              {prev.title}
            </span>
          </button>
        ) : (
          <div />
        )}
        {next ? (
          <button
            onClick={onNext ?? undefined}
            className="group flex flex-col items-end gap-1 rounded-sm border border-border/60 p-3 text-right transition-colors hover:border-border hover:bg-secondary/40"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-foreground/50">
              Next →
            </span>
            <span className="line-clamp-1 text-[13px] font-medium text-foreground">
              {next.title}
            </span>
          </button>
        ) : (
          <div />
        )}
      </nav>
    </div>
  )
}

function ResumeScreen() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 border-b border-border/60 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-xl font-bold text-foreground">{PROFILE.name}</div>
          <div className="mt-0.5 text-sm text-foreground/60">{PROFILE.role}</div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-foreground/50">
            <span>📍 {PROFILE.location}</span>
            <span>🌐 {PROFILE.site}</span>
          </div>
        </div>
        <a
          href={PROFILE.resumePdf}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-sm border border-gh-green/50 bg-gh-green/10 px-3 py-2 text-sm font-medium text-gh-green no-underline transition-colors hover:bg-gh-green/20"
        >
          ⬇ Download PDF
        </a>
      </div>

      <Section title="Profile">
        <p className="text-sm leading-relaxed text-foreground/75">{SUMMARY}</p>
      </Section>

      <Section title="Skills">
        <div className="space-y-2 text-sm">
          {SKILLS.map((g) => (
            <div key={g.category} className="flex gap-2">
              <span className="w-20 shrink-0 font-medium text-muted-foreground">
                {g.category}
              </span>
              <span className="text-foreground/85">{g.items.join(" · ")}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Education">
        <div className="border-l-2 border-gh-green/40 pl-3 text-sm">
          <div className="font-semibold text-foreground">{EDUCATION.degree}</div>
          <div className="text-muted-foreground">
            {EDUCATION.school} · {EDUCATION.period}
          </div>
        </div>
      </Section>

      <Section title="Languages">
        <p className="text-sm text-foreground/85">{LANGUAGES.join(" · ")}</p>
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-gh-blue">
        {title}
      </h3>
      {children}
    </section>
  )
}

function ContactForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  const canSubmit = name.trim() && email.trim() && message.trim()

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    const subject = encodeURIComponent(`Portfolio contact from ${name.trim()}`)
    const body = encodeURIComponent(
      `Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`
    )
    // Standard HTTP-aligned location, works in the browser/email clients.
    window.location.href =
      `mailto:${PROFILE.email}?subject=${subject}&body=${body}`
  }

  return (
    <form onSubmit={submit} className="space-y-3 font-mono text-sm">
      <label className="block">
        <span className="text-gh-green">$ name: </span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Doe"
          className="mt-1 w-full rounded-sm border border-border bg-background/40 px-3 py-2 text-foreground outline-none focus-visible:border-gh-green/50 focus-visible:focus-ring"
        />
      </label>
      <label className="block">
        <span className="text-gh-green">$ email: </span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="mt-1 w-full rounded-sm border border-border bg-background/40 px-3 py-2 text-foreground outline-none focus-visible:border-gh-green/50 focus-visible:focus-ring"
        />
      </label>
      <label className="block">
        <span className="text-gh-green">$ message: </span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Hi Erfan, ..."
          rows={4}
          className="mt-1 w-full resize-y rounded-sm border border-border bg-background/40 px-3 py-2 text-foreground outline-none focus-visible:border-gh-green/50 focus-visible:focus-ring"
        />
      </label>
      <button
        type="submit"
        className="rounded-sm border border-gh-green/50 bg-gh-green/10 px-4 py-2 text-sm font-medium text-gh-green transition-colors hover:bg-gh-green/20"
        disabled={!canSubmit}
      >
        [ Send Message ]
      </button>
      <p className="text-xs text-foreground/50">
        Opens your email app addressed to {PROFILE.email}.
      </p>
    </form>
  )
}

function ContactScreen() {
  const contactRows: Array<[string, ReactNode]> = [
    [
      "Email",
      <a
        key="e"
        href={`mailto:${PROFILE.email}`}
        className="text-accent hover:underline"
      >
        {PROFILE.email}
      </a>,
    ],
    [
      "GitHub",
      <a
        key="g"
        href={PROFILE.github}
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent hover:underline"
      >
        github.com/{PROFILE.githubUser}
      </a>,
    ],
    [
      "LinkedIn",
      <a
        key="l"
        href={PROFILE.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent hover:underline"
      >
        linkedin.com/in/erfan-ghesmati
      </a>,
    ],
  ]
  return (
    <div className="space-y-5">
      <TerminalTitle>contact — reach out</TerminalTitle>
      <div className="space-y-1 text-sm">
        {contactRows.map(([k, v]) => (
          <Row key={k} k={k} v={v} />
        ))}
      </div>
      <div className="space-y-3">
        <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-gh-blue sm:text-xs">
          message — cli form
        </div>
        <ContactForm />
      </div>
      <p className="text-xs text-muted-foreground">
        You can also open your email client or a social link above directly.
      </p>
    </div>
  )
}

function GithubScreen({ repos }: { repos: GitHubRepo[] }) {
  return (
    <div className="space-y-4">
      <TerminalTitle>github — EGhesmati</TerminalTitle>
      <div className="flex items-center gap-3 border-b border-border/60 pb-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-gh-green/40 bg-gh-green/10 font-mono text-base font-bold text-gh-green">
          EG
        </div>
        <div className="min-w-0">
          <div className="truncate font-mono text-sm font-semibold text-foreground">
            {PROFILE.githubUser}
          </div>
          <div className="text-xs text-muted-foreground">
            {PROFILE.name} · {PROFILE.role}
          </div>
        </div>
        <a
          href={PROFILE.github}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto shrink-0 rounded-sm border border-border px-2.5 py-1.5 text-xs font-medium text-foreground/80 no-underline transition-colors hover:bg-secondary"
        >
          View profile
        </a>
      </div>
      <p className="text-sm text-foreground/75">
        Browse my public repositories right here:
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {repos.map((r) => (
          <a
            key={r.id}
            href={r.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm border border-border bg-secondary/30 p-3 no-underline transition-colors hover:border-gh-green/40"
          >
            <div className="font-mono text-sm font-semibold text-accent">
              {r.name}
            </div>
            <p className="mt-1 line-clamp-2 text-xs leading-snug text-foreground/70">
              {r.description || "No description provided."}
            </p>
            <div className="mt-2 font-mono text-[11px] text-foreground/50">
              {r.language || "—"}
            </div>
          </a>
        ))}
      </div>
      {repos.length === 0 && (
        <p className="text-sm text-foreground/60">
          No public repositories found.
        </p>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════
   One-off command outputs (transcript messages)
   ══════════════════════════════════════════════ */

function HelpNode() {
  const cmds: Array<[string, string]> = [
    ["about", "Profile & bio"],
    ["skills", "Technical capability list"],
    ["projects", "Featured repositories"],
    ["blog", "Technical writing"],
    ["blog <slug>", "Read a post"],
    ["resume", "View / download CV"],
    ["contact", "Contact info + form"],
    ["github", "GitHub profile"],
    ["whoami", "Who is this user"],
    ["neofetch", "System snapshot"],
    ["ls", "List directory"],
    ["cat <file>", "Print a file"],
    ["history", "Command history"],
    ["open <view>", "Open a view"],
    ["clear", "Clear terminal"],
    ["help", "Show this help"],
  ]
  return (
    <div className="space-y-2">
      <div className="text-gh-green font-semibold">
        Available commands:
      </div>
      <div className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2">
        {cmds.map(([cmd, desc]) => (
          <div key={cmd} className="flex gap-2">
            <span className="w-36 shrink-0 text-gh-green">{cmd}</span>
            <span className="text-foreground/60">{desc}</span>
          </div>
        ))}
      </div>
      <div className="pt-1 text-xs text-foreground/50">
        <span className="text-gh-blue">Shortcuts:</span> Tab = autocomplete ·
        ↑↓ = history · Ctrl+K = focus · Ctrl+L = clear
      </div>
    </div>
  )
}

function NeofetchNode() {
  const rows: Array<[string, string]> = [
    ["OS", "erfan.dev"],
    ["Role", PROFILE.role],
    ["Frontend", "React · Next.js · Tailwind CSS"],
    ["Backend", "Node.js · Express · REST APIs"],
    ["Tools", "Git · GitHub · Docker · npm"],
    ["Education", "B.Sc. Computer Engineering (exp. 2027)"],
    ["Location", "Turkey"],
  ]
  return (
    <div className="flex flex-col gap-4 text-sm sm:flex-row sm:gap-8">
      <pre
        aria-hidden="true"
        className="hidden select-none whitespace-pre text-gh-green leading-tight sm:block"
      >
{`    ███████╗
    ██╔════╝
    █████╗
    ██╔══╝
    ███████╗
    ╚══════╝`}
      </pre>
      <div className="space-y-1">
        <div>
          <span className="font-semibold text-gh-green">erfan</span>
          <span className="text-foreground/50">@</span>
          <span className="font-semibold text-gh-blue">erfan.dev</span>
        </div>
        <div className="text-foreground/30">─────────────────────────</div>
        {rows.map(([k, v]) => (
          <div key={k} className="flex gap-3">
            <span className="w-20 shrink-0 text-gh-green">{k}</span>
            <span className="text-foreground">{v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function WhoamiNode() {
  return (
    <div>
      <div className="text-lg font-bold text-foreground">Erfan Ghesmati</div>
      <div className="text-foreground/70">
        {PROFILE.role} · Computer Engineering Student
      </div>
      <div className="mt-2 max-w-lg text-sm leading-relaxed text-foreground/70">
        {PROFILE.bio}
      </div>
    </div>
  )
}

function LsNode() {
  const items: Array<[string, boolean]> = [
    ["blog/", true],
    ["projects/", true],
    ["resume", false],
    ["developer.json", false],
    ["skills.json", false],
    ["education.json", false],
    ["experience.json", false],
    ["contact.json", false],
  ]
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-1">
      {items.map(([name, dir]) => (
        <span key={name} className={dir ? "text-gh-blue" : "text-foreground/90"}>
          {name}
        </span>
      ))}
    </div>
  )
}

function CatNode({ arg }: { arg?: string }) {
  const file = (arg || "").toLowerCase()
  const files: Record<string, { label: string; rows: [string, string][] }> = {
    "skills.json": {
      label: "Technical Skills",
      rows: [
        ["languages", "JavaScript · TypeScript · HTML5 · CSS3"],
        ["frontend", "React · Next.js · Tailwind CSS · Vite"],
        ["backend", "REST APIs · Node.js · Express.js"],
        ["tools", "Git · GitHub · Docker · npm · VS Code"],
      ],
    },
    "education.json": {
      label: "Education",
      rows: [
        ["degree", "B.Sc. Computer Engineering"],
        ["school", "Manisa Celal Bayar University"],
        ["graduation", "Expected 2027"],
      ],
    },
    "experience.json": {
      label: "Experience",
      rows: [
        ["role", "Computer Engineering Student"],
        ["focus", "React · Next.js · TypeScript"],
      ],
    },
    "contact.json": {
      label: "Contact",
      rows: [
        ["email", PROFILE.email],
        ["github", `github.com/${PROFILE.githubUser}`],
        ["linkedin", "linkedin.com/in/erfan-ghesmati-19b031225"],
      ],
    },
  }
  if (!file) {
    return (
      <span className="text-foreground/70">
        usage: cat {Object.keys(files).join(" | ")}
      </span>
    )
  }
  const target = files[file]
  if (!target) {
    return (
      <span className="text-gh-red">
        cat: {file}: No such file or directory. Try{" "}
        <span className="text-gh-green">ls</span>.
      </span>
    )
  }
  return (
    <div>
      <div className="mb-1 font-semibold text-gh-blue">{target.label}</div>
      {target.rows.map(([k, v]) => (
        <div key={k} className="flex gap-3 text-sm">
          <span className="w-28 shrink-0 text-gh-green">{k}</span>
          <span className="text-foreground/90">{v}</span>
        </div>
      ))}
    </div>
  )
}

function GitNode({ args }: { args: string[] }) {
  const sub = args[0]
  if (sub === "status") {
    return (
      <div>
        <div className="text-gh-green">On branch main</div>
        <div className="mt-1 text-foreground/70">nothing to commit</div>
      </div>
    )
  }
  if (sub === "log") {
    return (
      <div className="space-y-2">
        {[
          ["a1b2c3d", "feat: transform portfolio to a live terminal"],
          ["e4f5g6h", "feat: add interactive terminal shell"],
          ["i7j8k9l", "chore: dark-first design system"],
        ].map(([hash, msg]) => (
          <div key={hash} className="flex gap-2 text-sm">
            <span className="shrink-0 text-gh-orange">{hash}</span>
            <span>{msg}</span>
          </div>
        ))}
      </div>
    )
  }
  if (sub === "branch") {
    return <span className="text-gh-green">* main</span>
  }
  return (
    <div className="text-sm text-foreground/70">
      usage: git {"<command>"}
      <div className="mt-1 text-foreground/50">
        Common commands: status, log, branch
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════
   Terminal Shell (main)
   ══════════════════════════════════════════════ */

const SUGGESTIONS = [
  "help",
  "about",
  "projects",
  "blog",
  "resume",
  "contact",
  "skills",
]

const NAV_IDS = new Set<Screen["id"]>([
  "home",
  "about",
  "skills",
  "projects",
  "blog",
  "resume",
  "contact",
  "github",
])

export function TerminalShell({
  initialCommand,
  initialPostSlug,
  posts,
  repos = [],
}: TerminalShellProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const idCounter = useRef(0)

  const postsBySlug = useMemo(() => {
    const map = new Map<string, RenderedPost>()
    posts.forEach((p) => map.set(p.slug, p))
    return map
  }, [posts])

  const sortedPosts = useMemo(
    () =>
      [...posts].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    [posts]
  )

  // Lazy-initialize the screen from the route's initial command (avoids
  // calling setState synchronously inside an effect on mount).
  const [screen, setScreen] = useState<Screen>(() => {
    if (initialPostSlug && postsBySlug.has(initialPostSlug)) {
      return { id: "blog", selectedSlug: initialPostSlug }
    }
    if (initialCommand && initialCommand !== "home") {
      const id = initialCommand as Screen["id"]
      if (NAV_IDS.has(id)) {
        return { id } as Screen
      }
    }
    return { id: "home" }
  })

  const screenRef = useRef(screen)
  // When set, the next non-render update scrolls the terminal body to the
  // top (used after every command/view change so each screen starts at 0).
  const pendingTopRef = useRef(false)

  const [log, setLog] = useState<LogEntry[]>([])
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [showSuggestions, setSuggestions] = useState(false)
  const [suggestionItems, setSuggestionItems] = useState<string[]>([])

  // Keep the ref in sync for the `back` command (assigned in an effect,
  // not during render). Also surface the active view to the header taskbar.
  useEffect(() => {
    screenRef.current = screen
    setTerminalView(screen.id)
  }, [screen])

  const addLog = useCallback((entry: Omit<LogEntry, "id">) => {
    idCounter.current += 1
    setLog((prev) => [...prev, { ...entry, id: idCounter.current }])
  }, [])

  const scrollToTop = useCallback(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = 0
    }
  }, [])

  const focusInput = useCallback(() => {
    // preventScroll so focusing the prompt doesn't auto-scroll the terminal
    // to the bottom, which would override our scroll-to-top on new views.
    inputRef.current?.focus({ preventScroll: true })
  }, [])

  // After every command/view change, start each screen from the top.
  useEffect(() => {
    if (pendingTopRef.current) {
      pendingTopRef.current = false
      scrollToTop()
    }
  }, [log, screen, scrollToTop])

  // Global Ctrl+K focuses input
  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        focusInput()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [focusInput])

  // Re-focus input whenever the screen changes (so typing always lands here)
  useEffect(() => {
    focusInput()
  }, [screen, focusInput])

  const pushCmd = useCallback(
    (raw: string) => {
      idCounter.current += 1
      setLog((prev) => [...prev, { id: idCounter.current, kind: "cmd", text: raw }])
    },
    []
  )

  const go = useCallback((id: Screen["id"]) => {
    pendingTopRef.current = true
    setScreen({ id } as Screen)
  }, [])

  const openPost = useCallback(
    (slug: string) => {
      pendingTopRef.current = true
      setScreen({ id: "blog", selectedSlug: slug })
    },
    []
  )

  const openProject = useCallback((name: string) => {
    pendingTopRef.current = true
    setScreen({ id: "projects", selected: name })
  }, [])

  const navigateScreen = useCallback(
    (id: Screen["id"]) => {
      pendingTopRef.current = true
      focusInput()
      setScreen({ id } as Screen)
    },
    [focusInput]
  )

  const postNav = useCallback(
    (current: string, direction: 1 | -1) => {
      const index = sortedPosts.findIndex((p) => p.slug === current)
      if (index === -1) return
      const next = sortedPosts[index + direction]
      if (next) openPost(next.slug)
    },
    [sortedPosts, openPost]
  )

  const executeCommand = useCallback(
    (raw: string) => {
      const trimmed = raw.trim()
      pushCmd(raw)
      pendingTopRef.current = true

      if (!trimmed) return

      const parts = trimmed.split(/\s+/)
      const rawCmd = parts[0].toLowerCase()
      const cmd = COMMAND_ALIASES[rawCmd] || rawCmd
      const args = parts.slice(1)

      setHistory((prev) => (prev[prev.length - 1] === trimmed ? prev : [...prev, trimmed]))
      setHistoryIndex(-1)
      setInput("")
      setSuggestions(false)
      setSuggestionItems([])

      if (cmd === "clear") {
        setLog([])
        setScreen({ id: "home" })
        return
      }

      if (cmd === "help") {
        addLog({ kind: "msg", node: <HelpNode /> })
        return
      }

      if (cmd === "whoami") {
        addLog({ kind: "msg", node: <WhoamiNode /> })
        return
      }

      if (cmd === "neofetch") {
        addLog({ kind: "msg", node: <NeofetchNode /> })
        return
      }

      if (cmd === "ls") {
        addLog({ kind: "msg", node: <LsNode /> })
        return
      }

      if (cmd === "cat") {
        addLog({ kind: "msg", node: <CatNode arg={args[0]} /> })
        return
      }

      if (cmd === "git") {
        addLog({ kind: "msg", node: <GitNode args={args} /> })
        return
      }

      if (cmd === "pwd") {
        addLog({ kind: "msg", node: <span className="text-gh-blue">/home/erfan/dev</span> })
        return
      }

      if (cmd === "echo") {
        addLog({ kind: "msg", node: <span className="text-foreground">{args.join(" ") || "\u00A0"}</span> })
        return
      }

      if (cmd === "history") {
        addLog({ kind: "msg", node: <HistoryNode history={history} /> })
        return
      }

      if (cmd === "open") {
        const id = args[0]?.toLowerCase() as Screen["id"]
        if (id && NAV_IDS.has(id)) {
          navigateScreen(id)
          return
        }
        addLog({ kind: "msg", error: true, node: <span className="text-gh-red">open: unknown view.</span> })
        return
      }

      if (cmd === "back") {
        const current = screenRef.current
        if (current.id === "blog" && current.selectedSlug) {
          setScreen({ id: "blog", selectedSlug: null })
        } else if (current.id === "projects" && current.selected) {
          setScreen({ id: "projects", selected: null })
        } else {
          navigateScreen("home")
        }
        return
      }

      // Screen-targeting commands
      if (cmd === "about" || cmd === "skills" || cmd === "resume" || cmd === "contact" || cmd === "github" || cmd === "home") {
        navigateScreen(cmd as Screen["id"])
        return
      }

      if (cmd === "projects") {
        navigateScreen("projects")
        return
      }

      if (cmd === "blog") {
        if (args[0]) {
          const slug = args[0]
          if (postsBySlug.has(slug)) openPost(slug)
          else
            addLog({
              kind: "msg",
              error: true,
              node: (
                <span className="text-gh-red">
                  blog: post not found &quot;{slug}&quot;.
                </span>
              ),
            })
        } else {
          navigateScreen("blog")
        }
        return
      }

      if (cmd === "repo") {
        if (args[0]?.toLowerCase() === "view" && args[1]) {
          openProject(args.slice(1).join(" "))
        } else {
          navigateScreen("projects")
        }
        return
      }

      // Unknown command
      addLog({
        kind: "msg",
        error: true,
        node: (
          <span className="text-gh-red">
            zsh: command not found: {rawCmd}. Type{" "}
            <span className="text-gh-green">help</span> for available commands.
          </span>
        ),
      })
    },
    [pushCmd, addLog, history, navigateScreen, openPost, postsBySlug, openProject]
  )

  // Let the header "taskbar" dispatch commands into this terminal instance.
  useEffect(() => {
    const unbind = registerTerminalHandler((cmd) => executeCommand(cmd))
    return unbind
  }, [executeCommand])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault()
        executeCommand(input)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        if (history.length === 0) return
        const idx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(idx)
        setInput(history[idx])
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        if (historyIndex === -1) return
        const idx = historyIndex + 1
        if (idx >= history.length) {
          setHistoryIndex(-1)
          setInput("")
        } else {
          setHistoryIndex(idx)
          setInput(history[idx])
        }
      } else if (e.key === "Tab") {
        e.preventDefault()
        const trimmed = input.trim().toLowerCase()
        if (!trimmed) {
          setSuggestionItems(SUGGESTIONS)
          setSuggestions(true)
          return
        }
        const [c, ...rest] = input.split(/\s+/)
        if (c === "open") {
          const partial = rest.join("").toLowerCase()
          const matches = Array.from(NAV_IDS).filter((id) => id.startsWith(partial))
          if (matches.length === 1) setInput(`open ${matches[0]}`)
          else if (matches.length > 1) {
            setSuggestionItems(matches)
            setSuggestions(true)
          }
        } else if (c === "blog") {
          const partial = rest.join("").toLowerCase()
          const matches = sortedPosts
            .map((p) => p.slug)
            .filter((s) => s.startsWith(partial))
          if (matches.length === 1) setInput(`blog ${matches[0]}`)
          else if (matches.length > 1) {
            setSuggestionItems(matches)
            setSuggestions(true)
          }
        } else {
          const matches = Object.keys(COMMAND_ALIASES).filter((k) =>
            k.startsWith(trimmed)
          )
          if (matches.length === 1) setInput(matches[0])
          else if (matches.length > 1) {
            setSuggestionItems(matches)
            setSuggestions(true)
          }
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === "l") {
        e.preventDefault()
        setLog([])
        setScreen({ id: "home" })
      } else {
        setSuggestions(false)
        setSuggestionItems([])
      }
    },
    [executeCommand, history, historyIndex, input, sortedPosts]
  )

  // Current screen content
  const currentScreen = screen

  return (
    <div
      className="terminal-window"
      onClick={(e) => {
        // Focus the prompt when clicking on plain terminal surface, but never
        // steal focus from form fields / links / interactive controls.
        const target = e.target as HTMLElement
        if (
          target.closest(
            "input, textarea, select, button, a, [role='button'], .terminal-input"
          )
        ) {
          return
        }
        focusInput()
      }}
      role="application"
      aria-label="erfan developer terminal"
    >
      {/* Title bar */}
      <div className="terminal-titlebar">
        <div className="terminal-dot bg-gh-red" />
        <div className="terminal-dot bg-gh-orange" />
        <div className="terminal-dot bg-gh-green" />
        <span className="ml-2 truncate font-mono text-xs text-foreground/60">
          {PROMPT_USER}@{PROMPT_HOST}:{PROMPT_CWD} — zsh
        </span>
        <span className="ml-auto hidden shrink-0 items-center gap-1 font-mono text-[10px] text-foreground/40 sm:inline-flex">
          <span className="inline-block size-1.5 rounded-full bg-gh-green" />
          online
        </span>
      </div>

      {/* Terminal body */}
      <div ref={bodyRef} className="terminal-body" tabIndex={-1}>
        {/* Boot banner */}
        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-foreground/50">
          <span className="text-gh-green">erfan@dev</span>
          <span>Interactive Developer Terminal</span>
          <span className="ml-auto hidden sm:inline">zsh · ~/portfolio</span>
        </div>

        {/* Transcript log */}
        {log.map((entry) => (
          <div key={entry.id} className="mb-3">
            {entry.kind === "cmd" && (
              <div className="flex items-center gap-1 break-all">
                <Prompt />
                <span className="ml-1 text-foreground">{entry.text}</span>
              </div>
            )}
            {entry.kind === "msg" && (
              <div className={cn("mt-1", !entry.error && "ml-0")}>{entry.node}</div>
            )}
          </div>
        ))}

        {/* Active screen */}
        <div className="mt-2">
          <RenderScreen
            screen={currentScreen}
            posts={sortedPosts}
            postsBySlug={postsBySlug}
            repos={repos}
            open={go}
            openPost={openPost}
            openProject={openProject}
            postNav={postNav}
          />
        </div>

        {/* Input line */}
        <div className="mt-4 flex items-center">
          <Prompt />
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              setHistoryIndex(-1)
              setSuggestions(false)
              setSuggestionItems([])
            }}
            onKeyDown={handleKeyDown}
            className="terminal-input ml-1 flex-1"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            aria-label="Terminal input"
            aria-autocomplete="list"
          />
          <span className="hidden text-xs text-foreground/30 sm:inline">⬇ scrolled</span>
        </div>

        {/* Quick command suggestions */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 pb-1">
          <span className="shrink-0 text-[10px] uppercase tracking-wider text-foreground/40">
            Try:
          </span>
          {SUGGESTIONS.filter((c) => !(screen.id !== "home" && c === "home")).map((cmd) => (
            <button
              key={cmd}
              onClick={() => {
                setInput(cmd)
                executeCommand(cmd)
                focusInput()
              }}
              className="min-h-[34px] cursor-pointer rounded-sm border border-border bg-secondary/40 px-3 py-1.5 font-mono text-[11px] text-gh-green transition-colors hover:border-gh-green/40 hover:bg-secondary sm:text-xs"
            >
              {cmd}
            </button>
          ))}
        </div>

        {/* Autocomplete suggestions */}
        {showSuggestions && suggestionItems.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-gh-green">
            {suggestionItems.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setInput(s)
                  setSuggestions(false)
                  setSuggestionItems([])
                  focusInput()
                }}
                className="cursor-pointer text-left font-mono text-sm hover:underline"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function HistoryNode({ history }: { history: string[] }) {
  if (history.length === 0) {
    return <span className="text-foreground/50">No commands in history yet.</span>
  }
  return (
    <div className="space-y-0.5 text-sm">
      {history.map((c, i) => (
        <div key={i} className="flex gap-3">
          <span className="w-6 text-right text-foreground/40">{i + 1}</span>
          <span className="text-foreground">{c}</span>
        </div>
      ))}
    </div>
  )
}

/* ══════════════════════════════════════════════
   Screen dispatcher
   ══════════════════════════════════════════════ */

function RenderScreen({
  screen,
  posts,
  postsBySlug,
  repos,
  open,
  openPost,
  openProject,
  postNav,
}: {
  screen: Screen
  posts: RenderedPost[]
  postsBySlug: Map<string, RenderedPost>
  repos: GitHubRepo[]
  open: (id: Screen["id"]) => void
  openPost: (slug: string) => void
  openProject: (name: string) => void
  postNav: (current: string, direction: 1 | -1) => void
}) {
  switch (screen.id) {
    case "home":
      return <HomeScreen open={open} />
    case "about":
      return <AboutScreen />
    case "skills":
      return <SkillsScreen />
    case "projects":
      return (
        <ProjectsScreen
          repos={repos}
          selected={screen.selected}
          onSelect={openProject}
          onBack={() => open("projects")}
        />
      )
    case "blog": {
      if (screen.selectedSlug) {
        const post = postsBySlug.get(screen.selectedSlug)
        if (!post) {
          return (
            <div>
              <button
                onClick={() => open("blog")}
                className="mb-3 font-mono text-xs text-accent hover:underline"
              >
                ← Back to blog
              </button>
              <div className="text-gh-red">Post not found.</div>
            </div>
          )
        }
        return (
          <PostScreen
            post={post}
            posts={posts}
            onBack={() => open("blog")}
            onPrev={postNav ? () => postNav(post.slug, 1) : null}
            onNext={postNav ? () => postNav(post.slug, -1) : null}
          />
        )
      }
      return <BlogIndex posts={posts} onOpen={openPost} />
    }
    case "resume":
      return <ResumeScreen />
    case "contact":
      return <ContactScreen />
    case "github":
      return <GithubScreen repos={repos} />
    default:
      return <HomeScreen open={open} />
  }
}
