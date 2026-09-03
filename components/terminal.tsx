"use client"

import { useState, useRef, useEffect, useCallback, type KeyboardEvent, type MutableRefObject } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { PROJECTS } from "@/lib/portfolio-data"
import type { WindowId } from "@/components/window-manager/types"

const COMMANDS = [
  "help",
  "about",
  "skills",
  "projects",
  "experience",
  "education",
  "github",
  "blog",
  "contact",
  "resume",
  "neofetch",
  "repo",
  "clear",
  "history",
  "cat",
  "ls",
  "pwd",
  "whoami",
  "echo",
  "git",
] as const

const FILES = [
  "developer.json",
  "education.json",
  "experience.json",
  "skills.json",
  "contact.json",
] as const

interface TerminalEntry {
  id: number
  input: string
  output: React.ReactNode
}

const PROMPT = "erfan@dev"
const CWD = "~"

function PromptText() {
  return (
    <span>
      <span className="text-gh-green">{PROMPT}</span>
      <span className="text-muted-foreground">:</span>
      <span className="text-gh-blue">{CWD}</span>
      <span className="text-foreground">$ </span>
    </span>
  )
}

interface TerminalProps {
  initialOutput?: React.ReactNode
  className?: string
  /** Commands to auto-run once on mount, simulating a live shell session. */
  bootCommands?: string[]
  /** Called when a command requests opening an application window. */
  onOpenWindow?: (id: WindowId) => void
  /** Ref receiving a function that focuses the terminal input (for the dock). */
  focusRef?: MutableRefObject<() => void>
}

/** Commands that also open an application window in the desktop environment. */
const WINDOW_COMMANDS = new Set([
  "projects",
  "blog",
  "resume",
  "contact",
  "about",
  "skills",
  "github",
])

export function Terminal({ initialOutput, className, bootCommands, onOpenWindow, focusRef }: TerminalProps) {
  const [entries, setEntries] = useState<TerminalEntry[]>([])
  const [input, setInput] = useState("")
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const idCounter = useRef(0)

  const getNextId = useCallback(() => {
    idCounter.current += 1
    return idCounter.current
  }, [])

  const scrollToBottom = useCallback(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [entries, scrollToBottom])

  const executeCommand = useCallback(
    (cmd: string) => {
      const trimmed = cmd.trim()
      const parts = trimmed.split(/\s+/)
      const command = parts[0]?.toLowerCase() || ""
      const args = parts.slice(1)

      const id = getNextId()

      if (!command) {
        setEntries((prev) => [
          ...prev,
          { id, input: trimmed, output: null },
        ])
        return
      }

      const output = getCommandOutput(command, args)

      // CLI is the primary interaction model: app commands also open their
      // desktop window while printing a confirmation to the terminal log.
      const windowId: WindowId = command === "repo" ? "projects" : (command as WindowId)
      if (
        onOpenWindow &&
        (WINDOW_COMMANDS.has(command) ||
          (command === "repo" && (args[0] === "list" || args[0] === "view")))
      ) {
        onOpenWindow(windowId)
      }

      if (command === "clear") {
        setEntries([])
        return
      }

      if (command === "history") {
        setEntries((prev) => [
          ...prev,
          {
            id,
            input: trimmed,
            output: commandHistory.length === 0 ? (
              <span className="text-muted-foreground">No commands in history yet.</span>
            ) : (
              <div className="space-y-0.5 text-sm">
                {commandHistory.map((c, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="text-muted-foreground/50 w-6 text-right">{i + 1}</span>
                    <span className="text-foreground">{c}</span>
                  </div>
                ))}
              </div>
            ),
          },
        ])
        setCommandHistory((prev) => [...prev, trimmed])
        setHistoryIndex(-1)
        return
      }

      setEntries((prev) => [
        ...prev,
        { id, input: trimmed, output },
      ])

      setCommandHistory((prev) =>
        prev[prev.length - 1] === trimmed ? prev : [...prev, trimmed]
      )
      setHistoryIndex(-1)
    },
    [getNextId, commandHistory, onOpenWindow]
  )

  // Boot sequence: replay commands in a realistic shell session on mount.
  const booted = useRef(false)
  useEffect(() => {
    if (!bootCommands || bootCommands.length === 0 || booted.current) return
    booted.current = true
    let cancelled = false
    bootCommands.forEach((cmd, i) => {
      const delay = 160 + i * 340
      window.setTimeout(() => {
        if (!cancelled) executeCommand(cmd)
      }, delay)
    })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault()
        executeCommand(input)
        setInput("")
        setShowSuggestions(false)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        if (commandHistory.length === 0) return
        const newIndex =
          historyIndex === -1
            ? commandHistory.length - 1
            : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setInput(commandHistory[newIndex])
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        if (historyIndex === -1) return
        const newIndex = historyIndex + 1
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1)
          setInput("")
        } else {
          setHistoryIndex(newIndex)
          setInput(commandHistory[newIndex])
        }
      } else if (e.key === "Tab") {
        e.preventDefault()
        const trimmed = input.trim()
        const [cmd, ...rest] = trimmed.split(/\s+/)
        const lowerCmd = cmd?.toLowerCase() || ""
        let matches: string[]
        if (lowerCmd === "cat" || lowerCmd === "ls") {
          const partial = rest.join(" ").toLowerCase() || ""
          matches = FILES.filter((f) => f.startsWith(partial))
          if (matches.length === 1 && lowerCmd === "cat") {
            setInput(`cat ${matches[0]}`)
            setShowSuggestions(false)
            return
          }
        } else if (lowerCmd === "repo" && rest[0]?.toLowerCase() === "view") {
          const partial = rest.slice(1).join(" ").toLowerCase()
          matches = PROJECTS.map((p) => p.name).filter((n) =>
            n.toLowerCase().startsWith(partial)
          )
          if (matches.length === 1) {
            setInput(`repo view ${matches[0]}`)
            setShowSuggestions(false)
            return
          }
        } else {
          matches = COMMANDS.filter((c) =>
            c.startsWith(trimmed.toLowerCase())
          )
        }
        if (matches.length === 1) {
          setInput(
            lowerCmd === "cat" ? `cat ${matches[0]}` : lowerCmd === "ls" ? `ls ${matches[0]}` : matches[0]
          )
          setShowSuggestions(false)
        } else if (matches.length > 1) {
          setSuggestions(matches)
          setShowSuggestions(true)
        }
      } else if (e.key === "l" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        setEntries([])
      } else {
        setShowSuggestions(false)
      }
    },
    [input, commandHistory, historyIndex, executeCommand]
  )

  const focusInput = useCallback(() => {
    inputRef.current?.focus()
  }, [])

  // Expose focusInput to the dock via ref
  useEffect(() => {
    if (focusRef) {
      focusRef.current = focusInput
    }
  }, [focusRef, focusInput])

  useEffect(() => {
    const handleGlobalKey = (e: globalThis.KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        focusInput()
      }
    }
    window.addEventListener("keydown", handleGlobalKey)
    return () => window.removeEventListener("keydown", handleGlobalKey)
  }, [focusInput])

  return (
    <div
      className={cn("terminal-window", className)}
      onClick={focusInput}
      role="application"
      aria-label="Developer terminal"
    >
      {/* Title bar */}
      <div className="terminal-titlebar">
        <div className="terminal-dot bg-gh-red" />
        <div className="terminal-dot bg-gh-orange" />
        <div className="terminal-dot bg-gh-green" />
        <span className="ml-2 text-xs text-muted-foreground font-mono">
          {PROMPT} — zsh
        </span>
        <span className="ml-auto text-[10px] text-muted-foreground/50 font-mono">
          ● online
        </span>
      </div>

      {/* Terminal body */}
      <div ref={bodyRef} className="terminal-body" tabIndex={-1}>
        {/* Initial output (whoami banner) */}
        {initialOutput && entries.length === 0 && (
          <div className="terminal-output">{initialOutput}</div>
        )}

        {/* Command history */}
        {entries.map((entry) => (
          <div key={entry.id} className="terminal-output">
            <div className="terminal-line">
              <PromptText />
              <span className="text-foreground">{entry.input}</span>
            </div>
            {entry.output && (
              <div className="terminal-line mt-1">{entry.output}</div>
            )}
          </div>
        ))}

        {/* Current input */}
        <div className="terminal-line flex items-center">
          <PromptText />
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              setHistoryIndex(-1)
              setShowSuggestions(false)
            }}
            onKeyDown={handleKeyDown}
            className="terminal-input"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            aria-label="Terminal input"
            aria-autocomplete="list"
          />
        </div>

        {/* Quick command suggestions (mobile-friendly) */}
        <div className="mt-2 flex flex-wrap items-center gap-1.5 pb-1">
          <span className="text-[10px] text-muted-foreground/60 font-mono uppercase tracking-wider shrink-0">
            Try:
          </span>
          {["help", "about", "projects", "skills", "resume", "contact"].map(
            (cmd) => (
              <button
                key={cmd}
                onClick={() => {
                  setInput(cmd)
                  executeCommand(cmd)
                  focusInput()
                }}
                className="rounded-sm border border-border bg-secondary/40 px-3 py-2 font-mono text-xs text-gh-green hover:border-gh-green/40 hover:bg-secondary transition-colors cursor-pointer min-h-[36px] sm:min-h-[28px] sm:px-2 sm:py-1.5 sm:text-[11px]"
              >
                {cmd}
              </button>
            )
          )}
        </div>

        {/* Autocomplete suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-gh-green">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setInput(s)
                  setShowSuggestions(false)
                  focusInput()
                }}
                className="text-left font-mono text-sm hover:underline cursor-pointer"
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

/* ══════════════════════════════════════════════
   Command Output Renderers
   ══════════════════════════════════════════════ */

function getCommandOutput(
  command: string,
  args: string[]
): React.ReactNode {
  switch (command) {
    case "help":
      return <HelpOutput />
    case "about":
      return <AboutOutput />
    case "skills":
      return <SkillsOutput />
    case "projects":
      return <ProjectsOutput />
    case "experience":
      return <ExperienceOutput />
    case "education":
      return <EducationOutput />
    case "github":
      return <GithubOutput />
    case "blog":
      return <BlogOutput />
    case "contact":
      return <ContactOutput />
    case "resume":
      return <ResumeOutput />
    case "neofetch":
      return <NeofetchOutput />
    case "repo":
      return <RepoOutput args={args} />
    case "cat":
      return <CatOutput args={args} />
    case "echo":
      return <EchoOutput args={args} />
    case "ls":
      return <LsOutput args={args} />
    case "pwd":
      return <span className="text-gh-blue">/home/erfan/dev</span>
    case "whoami":
      return <WhoamiOutput />
    case "git":
      return <GitOutput args={args} />
    default:
      return (
        <span className="text-gh-red">
          zsh: command not found: {command}. Type{" "}
          <span className="text-gh-green">help</span> for available commands.
        </span>
      )
  }
}

function HelpOutput() {
  return (
    <div>
      <div className="text-gh-green font-semibold mb-2">Available commands:</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
        {[
          ["about", "About Erfan"],
          ["skills", "Technical skills"],
          ["projects", "Featured projects"],
          ["experience", "Experience"],
          ["education", "Education"],
          ["github", "GitHub profile"],
          ["blog", "Technical writing"],
          ["contact", "Contact information"],
          ["resume", "View/download resume"],
          ["neofetch", "System info"],
          ["repo list", "List repositories"],
          ["repo view <name>", "Inspect a repository"],
          ["ls", "List directory contents"],
          ["cat <file>", "Print a file"],
          ["clear", "Clear terminal"],
          ["history", "Command history"],
          ["git", "Git commands"],
        ].map(([cmd, desc]) => (
          <div key={cmd} className="flex gap-2">
            <span className="text-gh-green w-28 shrink-0">{cmd}</span>
            <span className="text-muted-foreground">{desc}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 text-muted-foreground text-xs">
        <span className="text-gh-blue">Shortcuts:</span>{" "}
        Tab = autocomplete · ↑↓ = history · Ctrl+K = focus · Ctrl+L = clear
      </div>
    </div>
  )
}

function AboutOutput() {
  return (
    <div className="space-y-3">
      <div className="text-gh-blue font-semibold">ERFAN — PROFILE</div>
      <div className="space-y-1 text-sm">
        <div className="flex gap-3">
          <span className="text-gh-green w-16 shrink-0">Name</span>
          <span className="text-foreground">Erfan Ghesmati</span>
        </div>
        <div className="flex gap-3">
          <span className="text-gh-green w-16 shrink-0">Role</span>
          <span className="text-foreground">Full-Stack Developer</span>
        </div>
        <div className="flex gap-3">
          <span className="text-gh-green w-16 shrink-0">Focus</span>
          <span className="text-foreground">Frontend · React · Modern JavaScript</span>
        </div>
        <div className="flex gap-3">
          <span className="text-gh-green w-16 shrink-0">Stack</span>
          <span className="text-foreground">React · Next.js · TypeScript · Tailwind CSS</span>
        </div>
        <div className="flex gap-3">
          <span className="text-gh-green w-16 shrink-0">Location</span>
          <span className="text-foreground">Turkey</span>
        </div>
      </div>
      <div className="pt-1 border-t border-border/30 text-sm text-foreground/70 leading-relaxed max-w-2xl">
        Passionate about building beautiful, functional web applications with clean, maintainable code and delightful user experiences.
      </div>
    </div>
  )
}

function SkillsOutput() {
  const categories = [
    {
      name: "Languages",
      items: ["JavaScript", "TypeScript", "HTML5", "CSS3"],
    },
    {
      name: "Frontend",
      items: ["React", "Next.js", "Tailwind CSS", "Vite"],
    },
    {
      name: "Backend",
      items: ["REST APIs", "Node.js", "Express.js"],
    },
    {
      name: "Tools",
      items: ["Git", "GitHub", "Docker", "npm", "VS Code"],
    },
  ]

  return (
    <div className="space-y-3">
      <div className="text-gh-blue font-semibold">TECHNICAL SKILLS</div>
      <div className="space-y-2 text-sm">
        {categories.map((cat) => (
          <div key={cat.name}>
            <div className="text-gh-green text-xs font-semibold uppercase tracking-wider mb-0.5">
              {cat.name}
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-foreground/90">
              {cat.items.map((item, idx) => (
                <span key={item}>
                  {item}
                  {idx < cat.items.length - 1 && <span className="text-muted-foreground">·</span>}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProjectsOutput() {
  return (
    <div className="space-y-3">
      <div className="text-gh-blue font-semibold">REPOSITORIES</div>
      <div className="space-y-3">
        {PROJECTS.map((p) => (
          <div key={p.name} className="border-l border-gh-green/40 pl-3">
            <div className="flex items-baseline gap-2">
              <span className="text-gh-green font-semibold">{p.name}</span>
              <a
                href={p.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-accent transition-colors"
                title="View on GitHub"
              >
                ↗
              </a>
            </div>
            <div className="text-sm text-foreground/70 mt-0.5">{p.desc}</div>
            <div className="flex flex-wrap gap-1.5 mt-1.5 text-xs">
              {p.tech.map((t, idx) => (
                <span key={t} className="text-muted-foreground">
                  {t}
                  {idx < p.tech.length - 1 && " ·"}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="pt-1 border-t border-border/30 text-xs text-muted-foreground">
        Run <span className="text-gh-green">repo view &lt;name&gt;</span> to inspect a
        repository, or visit{" "}
        <a href="/projects" className="text-accent hover:underline">
          /projects
        </a>{" "}
        for all repos.
      </div>
    </div>
  )
}

function RepoOutput({ args }: { args: string[] }) {
  const sub = args[0]?.toLowerCase()

  if (sub === "list" || !sub) {
    return (
      <div className="space-y-3">
        <div className="text-gh-blue font-semibold">REPOSITORIES</div>
        <div className="space-y-2 text-sm">
          {PROJECTS.map((p) => (
            <div key={p.name} className="space-y-0.5">
              <div className="text-gh-green font-semibold">{p.name}</div>
              <div className="text-muted-foreground text-xs">
                {p.tech.join(" · ")}
              </div>
            </div>
          ))}
        </div>
        <div className="pt-1 border-t border-border/30 text-xs text-muted-foreground">
          Usage: <span className="text-gh-green">repo view &lt;name&gt;</span>
        </div>
      </div>
    )
  }

  if (sub === "view") {
    const name = args[1]?.toLowerCase()
    const project = PROJECTS.find((p) => p.name.toLowerCase() === name)

    if (!name) {
      return (
        <span className="text-muted-foreground">
          Usage: <span className="text-gh-green">repo view &lt;name&gt;</span> — e.g.{" "}
          <span className="text-gh-green">repo view MovieTracker</span>
        </span>
      )
    }

    if (!project) {
      return (
        <span className="text-gh-red">
          Repository not found: {args[1]}. Run{" "}
          <span className="text-gh-green">repo list</span> to see available
          repositories.
        </span>
      )
    }

    return (
      <div className="space-y-3 max-w-2xl">
        <div>
          <div className="text-gh-green font-semibold">{project.name}</div>
          <div className="text-muted-foreground text-xs">
            ────────────────────────────────────
          </div>
        </div>
        <p className="text-sm text-foreground/70 leading-relaxed">
          {project.desc}
        </p>
        <div className="space-y-1 text-sm">
          <div className="text-gh-blue font-semibold text-xs tracking-wide">
            TECHNOLOGIES
          </div>
          {project.tech.map((t) => (
            <div key={t} className="text-foreground">
              {t}
            </div>
          ))}
        </div>
        <div className="space-y-1 text-sm">
          <div className="text-gh-blue font-semibold text-xs tracking-wide">
            FEATURES
          </div>
          {project.features.map((f) => (
            <div key={f} className="text-foreground/80 flex gap-2">
              <span className="text-gh-green">•</span>
              <span>{f}</span>
            </div>
          ))}
        </div>
        <div className="space-y-1 text-sm">
          <div className="text-gh-blue font-semibold text-xs tracking-wide">
            LINKS
          </div>
          <div className="flex gap-2">
            <span className="text-gh-green">→</span>
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              Repository
            </a>
          </div>
          {project.live && (
            <div className="flex gap-2">
              <span className="text-gh-green">→</span>
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                Live Demo
              </a>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <span className="text-muted-foreground">
      Unknown subcommand: {sub}. Usage:{" "}
      <span className="text-gh-green">repo list</span> ·{" "}
      <span className="text-gh-green">repo view &lt;name&gt;</span>
    </span>
  )
}

function ExperienceOutput() {
  return (
    <div className="space-y-3">
      <div className="text-gh-blue font-semibold">EXPERIENCE</div>
      <div className="border-l border-gh-green/40 pl-3 text-sm">
        <div className="text-gh-green font-semibold">Computer Engineering Student</div>
        <div className="text-muted-foreground">Manisa Celal Bayar University · Expected 2027</div>
        <div className="mt-1.5 text-foreground/70 leading-relaxed max-w-2xl">
          Pursuing B.Sc. in Computer Engineering while building real-world web applications. Focused on frontend development with React, Next.js, and TypeScript.
        </div>
      </div>
      <div className="pt-1 border-t border-border/30 text-xs text-muted-foreground">
        Full details: <a href="/resume" className="text-accent hover:underline">/resume</a>
      </div>
    </div>
  )
}

function EducationOutput() {
  return (
    <div className="space-y-3">
      <div className="text-gh-blue font-semibold">EDUCATION</div>
      <div className="border-l border-gh-green/40 pl-3 text-sm">
        <div className="text-gh-green font-semibold">B.Sc. Computer Engineering</div>
        <div className="text-muted-foreground">Manisa Celal Bayar University</div>
        <div className="text-muted-foreground">Expected 2027</div>
      </div>
    </div>
  )
}

function NeofetchOutput() {
  const rows: Array<[string, string]> = [
    ["OS", "erfan.dev"],
    ["Role", "Full-Stack Developer"],
    ["Frontend", "React · Next.js · Tailwind CSS"],
    ["Backend", "Node.js · Express · REST APIs"],
    ["Tools", "Git · GitHub · Docker · npm"],
    ["Editor", "VS Code"],
    ["Education", "B.Sc. Computer Engineering (exp. 2027)"],
    ["Location", "Turkey"],
  ]

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:gap-8 text-sm">
      <pre
        aria-hidden="true"
        className="text-gh-green leading-tight select-none text-xs sm:text-sm"
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
          <span className="text-gh-green font-semibold">erfan</span>
          <span className="text-muted-foreground">@</span>
          <span className="text-gh-blue font-semibold">erfan.dev</span>
        </div>
        <div className="text-muted-foreground">─────────────────────────</div>
        {rows.map(([key, value]) => (
          <div key={key} className="flex gap-3">
            <span className="text-gh-green w-20 shrink-0">{key}</span>
            <span className="text-foreground">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function GithubOutput() {
  return (
    <div>
      <div className="text-gh-blue font-semibold mb-2">GitHub Profile</div>
      <div className="space-y-1.5">
        <div className="flex gap-4">
          <span className="text-gh-green w-20 shrink-0">Username</span>
          <a
            href="https://github.com/EGhesmati"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            EGhesmati
          </a>
        </div>
        <div className="flex gap-4">
          <span className="text-gh-green w-20 shrink-0">Profile</span>
          <a
            href="https://github.com/EGhesmati"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            github.com/EGhesmati
          </a>
        </div>
      </div>
      <div className="mt-3 text-xs text-muted-foreground">
        Run <span className="text-gh-green">projects</span> to see featured
        repositories.
      </div>
    </div>
  )
}

function BlogOutput() {
  return (
    <div className="space-y-3">
      <div className="text-gh-blue font-semibold">BLOG</div>
      <div className="text-foreground/70 text-sm mb-2">Technical writing about web development.</div>
      <div className="space-y-1.5 text-sm">
        <div className="flex gap-2 items-baseline">
          <span className="text-gh-green">→</span>
          <Link
            href="/blog/building-clean-nextjs-portfolio"
            className="text-accent hover:underline"
          >
            Building a Clean Next.js Portfolio
          </Link>
          <span className="text-xs text-muted-foreground">Jan 14</span>
        </div>
        <div className="flex gap-2 items-baseline">
          <span className="text-gh-green">→</span>
          <Link
            href="/blog/getting-started-with-typescript"
            className="text-accent hover:underline"
          >
            Getting Started with TypeScript
          </Link>
          <span className="text-xs text-muted-foreground">Jan 10</span>
        </div>
        <div className="flex gap-2 items-baseline">
          <span className="text-gh-green">→</span>
          <Link
            href="/blog/why-i-love-tailwind-css"
            className="text-accent hover:underline"
          >
            Why I Love Tailwind CSS
          </Link>
          <span className="text-xs text-muted-foreground">Jan 5</span>
        </div>
      </div>
      <div className="pt-1 border-t border-border/30 text-xs text-muted-foreground">
        All posts: <Link href="/blog" className="text-accent hover:underline">/blog</Link>
      </div>
    </div>
  )
}

function ContactOutput() {
  return (
    <div className="space-y-3">
      <div className="text-gh-blue font-semibold">CONTACT</div>
      <div className="space-y-1.5 text-sm">
        <div className="flex gap-3">
          <span className="text-gh-green w-16 shrink-0">Email</span>
          <a
            href="mailto:erfanghesmati53@gmail.com"
            className="text-accent hover:underline"
          >
            erfanghesmati53@gmail.com
          </a>
        </div>
        <div className="flex gap-3">
          <span className="text-gh-green w-16 shrink-0">GitHub</span>
          <a
            href="https://github.com/EGhesmati"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            github.com/EGhesmati
          </a>
        </div>
        <div className="flex gap-3">
          <span className="text-gh-green w-16 shrink-0">LinkedIn</span>
          <a
            href="https://www.linkedin.com/in/erfan-ghesmati-19b031225/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            linkedin.com/in/erfan-ghesmati
          </a>
        </div>
      </div>
      <div className="pt-1 border-t border-border/30 text-xs text-muted-foreground">
        More: <a href="/contact" className="text-accent hover:underline">/contact</a>
      </div>
    </div>
  )
}

function ResumeOutput() {
  return (
    <div className="space-y-3">
      <div className="text-gh-blue font-semibold">RESUME</div>
      <div className="text-foreground/70 text-sm">
        Erfan Ghesmati — Full-Stack Developer | Computer Engineering Student
      </div>
      <div className="flex flex-wrap gap-2 text-sm">
        <a
          href="/resume"
          className="inline-flex items-center gap-1 text-gh-green border border-gh-green/40 rounded-sm px-2.5 py-1 hover:bg-gh-green/10 transition-colors no-underline font-medium"
        >
          View Resume
        </a>
        <a
          href="https://www.dropbox.com/scl/fi/xxwn0irg4dhmvv5zpfb4h/Erfan_Ghesmati_Resume.pdf?rlkey=k4yrxbf9qgspn5pw5uphjawjy&st=ce3lt9jg&dl=0"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-accent border border-accent/40 rounded-sm px-2.5 py-1 hover:bg-accent/10 transition-colors no-underline font-medium"
        >
          Download CV ↗
        </a>
      </div>
    </div>
  )
}

function Alien() {
  return (
    <div className="alien-art" aria-hidden="true">
      {`   ▄▄▄▄▄▄
  █▀▀▀▀▀▀█
  █ █ █ ██
  ██▄▄▄▄██
 ██████████
 ██ █  █ ██
  █ █ ██ █
   █▄▄▄▄█`}
    </div>
  )
}

function CatOutput({ args }: { args: string[] }) {
  const file = (args[0] || "").toLowerCase()

  if (!file) {
    return (
      <span className="text-foreground/70">
        usage: cat{" "}
        {FILES.map((f) => f).join(" | ")}
      </span>
    )
  }

  if (file === "developer.json") {
    const S = "text-accent" // string value
    return (
      <div className="font-mono text-sm leading-[1.6]">
        <div className="text-muted-foreground">{"// erfan.dev — developer profile"}</div>
        <pre className="whitespace-pre-wrap text-foreground/90 leading-[1.55]">
          <span>{"{"}</span>
          <br />
          {"  "}
          <span className="font-medium text-foreground">&quot;name&quot;</span>
          {": "}
          <span className={S}>&quot;Erfan Ghesmati&quot;</span>,<br />
          {"  "}
          <span className="font-medium text-foreground">&quot;role&quot;</span>
          {": "}
          <span className={S}>
            &quot;Computer Engineering Student · Full-Stack Developer&quot;
          </span>,<br />
          {"  "}
          <span className="font-medium text-foreground">&quot;location&quot;</span>
          {": "}
          <span className={S}>&quot;Turkey&quot;</span>,<br />
          {"  "}
          <span className="font-medium text-foreground">&quot;focus&quot;</span>
          {": "}
          <span className={S}>
            &quot;Frontend development with React &amp; the modern JS ecosystem&quot;
          </span>,<br />
          {"  "}
          <span className="font-medium text-foreground">&quot;stack&quot;</span>
          {": ["}
          <br />
          <span className="text-muted-foreground">{"    "}</span>
          <span className={S}>&quot;React&quot;</span>, <span className={S}>&quot;Next.js&quot;</span>,{" "}
          <span className={S}>&quot;TypeScript&quot;</span>,
          <br />
          <span className="text-muted-foreground">{"    "}</span>
          <span className={S}>&quot;Tailwind CSS&quot;</span>, <span className={S}>&quot;Node.js&quot;</span>
          <br />
          {"  ]"},<br />
          {"  "}
          <span className="font-medium text-foreground">&quot;socials&quot;</span>
          {": {"}
          <br />
          <span className="text-muted-foreground">{"    "}</span>
          <span className="font-medium text-foreground">&quot;github&quot;</span>
          {": "}
          <span className={S}>&quot;github.com/EGhesmati&quot;</span>,<br />
          <span className="text-muted-foreground">{"    "}</span>
          <span className="font-medium text-foreground">&quot;linkedin&quot;</span>
          {": "}
          <span className={S}>
            &quot;linkedin.com/in/erfan-ghesmati-19b031225&quot;
          </span>
          <br />
          {"  }"},<br />
          {"  "}
          <span className="font-medium text-foreground">&quot;openToWork&quot;</span>
          {": "}
          <span className="text-gh-green">true</span>
          <br />
          <span>{"}"}</span>
        </pre>
        <div className="mt-3 flex items-start gap-4">
          <Alien />
          <div className="text-xs text-muted-foreground">
            <span className="text-gh-green">{"// 💚 1 alien found"}</span>
            <br />
            Get in touch —{" "}
            <a href="mailto:erfanghesmati53@gmail.com" className="text-accent hover:underline">
              erfanghesmati53@gmail.com
            </a>
          </div>
        </div>
      </div>
    )
  }

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
        ["note", "See resume for full details"],
      ],
    },
    "contact.json": {
      label: "Contact",
      rows: [
        ["email", "erfanghesmati53@gmail.com"],
        ["github", "github.com/EGhesmati"],
        ["linkedin", "linkedin.com/in/erfan-ghesmati-19b031225"],
      ],
    },
  }

  const target = files[file]
  if (!target) {
    return (
      <span className="text-gh-red">
        cat: {file}: No such file or directory. Try{" "}
        <span className="text-gh-green">cat developer.json</span> or{" "}
        <span className="text-gh-green">ls</span>.
      </span>
    )
  }

  return (
    <div className="font-mono text-sm leading-[1.6]">
      <div className="text-gh-blue font-semibold mb-1">{target.label}</div>
      {target.rows.map(([k, v]) => (
        <div key={k} className="flex gap-3">
          <span className="w-28 shrink-0 text-gh-green">{k}</span>
          <span className="text-foreground/90">{v}</span>
        </div>
      ))}
    </div>
  )
}

function EchoOutput({ args }: { args: string[] }) {
  const text = args.join(" ")
  const lower = text.toLowerCase()
  if (lower.includes("alien") || lower.includes("👽") || lower.includes("ufo")) {
    return (
      <div className="flex gap-4 items-center">
        <Alien />
        <div>
          <span className="text-gh-green">There&apos;s nothing alien here, human.</span>
          <div className="text-xs text-muted-foreground mt-0.5">I&apos;m a web developer, not a UFO enthusiast. 👀</div>
        </div>
      </div>
    )
  }
  return <span className="text-foreground">{text || "\n"}</span>
}

function LsOutput({ args }: { args: string[] }) {
  const dirs = [
    { name: "blog/", type: "dir", note: "technical writing" },
    { name: "projects/", type: "dir", note: "open-source work" },
    { name: "resume", type: "file", note: "download · view" },
  ]
  const files = [
    { name: "developer.json", type: "file", note: "whoami — in JSON" },
    { name: "skills.json", type: "file", note: "tech stack" },
    { name: "education.json", type: "file", note: "degrees" },
    { name: "experience.json", type: "file", note: "experience" },
    { name: "contact.json", type: "file", note: "reach me" },
  ]
  const extra = [
    { name: "about", type: "cmd", note: "" },
    { name: "contact", type: "cmd", note: "" },
    { name: "github", type: "cmd", note: "" },
    { name: "pwd", type: "cmd", note: "" },
    { name: "whoami", type: "cmd", note: "" },
    { name: "git", type: "cmd", note: "" },
  ]

  const long = args.includes("-l") || args.includes("-la")

  if (!long) {
    return (
      <div className="flex flex-wrap gap-x-6 gap-y-0.5">
        {[...dirs, ...files, ...extra].map((item) => (
          <span
            key={item.name}
            className={item.type === "dir" ? "text-gh-blue" : "text-foreground/90"}
          >
            {item.name}
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className="font-mono text-sm">
      <div className="text-muted-foreground">total {dirs.length + files.length + extra.length}</div>
      {[...dirs, ...files, ...extra].map((item) => (
        <div key={item.name} className="flex gap-6">
          <span className={item.type === "dir" ? "text-gh-blue" : "text-muted-foreground"}>
            {item.type === "dir" ? "drwxr-xr-x" : "-rw-r--r--"}
          </span>
          <span className="text-muted-foreground w-6">512</span>
          <span className={item.type === "dir" ? "w-24 text-gh-blue" : "w-24 text-foreground/90"}>
            {item.name}
            {item.note ? (
              <span className="ml-3 text-muted-foreground"># {item.note}</span>
            ) : null}
          </span>
        </div>
      ))}
      <div className="mt-2 text-xs text-muted-foreground">
        <span className="text-gh-green">Tip:</span> try{" "}
        <span className="text-gh-green">cat developer.json</span> to meet the
        developer — and an old friend.
      </div>
    </div>
  )
}

function WhoamiOutput() {
  return (
    <div>
      <div className="text-lg font-bold text-foreground">Erfan Ghesmati</div>
      <div className="text-foreground/70">
        Computer Engineering Student · Full-Stack Developer
      </div>
      <div className="mt-2 text-foreground/70 max-w-lg leading-relaxed">
        Building modern web applications with React, Next.js, TypeScript, and
        Tailwind CSS.
      </div>
      <div className="mt-3 text-xs text-muted-foreground">
        Type <span className="text-gh-green">help</span> to see available
        commands.
      </div>
    </div>
  )
}

function GitOutput({ args }: { args: string[] }) {
  const subcommand = args[0]

  if (subcommand === "status") {
    return (
      <div>
        <div className="text-gh-green">On branch main</div>
        <div className="text-foreground/70 mt-1">nothing to commit</div>
      </div>
    )
  }

  if (subcommand === "log") {
    return (
      <div className="space-y-2">
        {[
          {
            hash: "a1b2c3d",
            msg: "feat: transform portfolio to CLI experience",
            date: "just now",
          },
          {
            hash: "e4f5g6h",
            msg: "feat: add interactive terminal component",
            date: "moments ago",
          },
          {
            hash: "i7j8k9l",
            msg: "chore: update globals.css for dark-first design",
            date: "recently",
          },
        ].map((commit) => (
          <div key={commit.hash} className="flex gap-2 text-sm">
            <span className="text-gh-orange shrink-0">{commit.hash}</span>
            <span>{commit.msg}</span>
          </div>
        ))}
      </div>
    )
  }

  if (subcommand === "branch") {
    return (
      <div>
        <span className="text-gh-green">* main</span>
      </div>
    )
  }

  return (
    <div className="text-sm text-foreground/70">
      usage: git {'<command>'} [{"<args>"}]
      <div className="mt-1 text-muted-foreground">
        Common commands: status, log, branch
      </div>
    </div>
  )
}
