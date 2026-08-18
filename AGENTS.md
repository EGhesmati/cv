# AGENTS.md — Erfan Ghesmati Portfolio

## Project Overview

A minimalist personal portfolio website built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, and the **Mozilla Protocol** design system. The site is fully static-first, content-driven, and designed for deployment on Vercel.

- **Owner:** Erfan Ghesmati
- **Role:** Computer Engineer | Frontend Developer
- **Location:** Turkey
- **Live URL:** `https://erfanghesmati.com` (placeholder)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 (`@tailwindcss/postcss`) |
| Design System | Mozilla Protocol |
| Theming | `next-themes` (dark/light, system-aware) |
| Icons | `lucide-react` + `@icons-pack/react-simple-icons` |
| Content | Filesystem Markdown with `gray-matter` frontmatter |
| Markdown Pipeline | `remark` (parse, GFM) → `remark-rehype` → `rehype-slug` → `rehype-autolink-headings` → `rehype-pretty-code` → `rehype-stringify` |
| Syntax Highlighting | `rehype-pretty-code` (GitHub Dark Dimmed theme) |
| Deployment | Vercel (default hybrid: static + serverless) |

---

## Project Structure

```
cv/
├── app/
│   ├── globals.css              # Tailwind + Protocol tokens + prose typography
│   ├── layout.tsx               # Root layout: ThemeProvider > Header + Footer
│   ├── page.tsx                 # Landing page: Hero, About, Projects, Recent Posts
│   ├── not-found.tsx            # Custom 404
│   ├── sitemap.ts               # Dynamic sitemap.xml (posts, tags, static routes)
│   ├── api/rss/route.ts         # RSS feed endpoint (serverless)
│   ├── blog/
│   │   ├── page.tsx             # All posts + tag filter badges
│   │   ├── [slug]/page.tsx      # Single post: TOC, prev/next, syntax highlighting
│   │   └── tag/[tag]/page.tsx   # Filtered posts by tag
│   ├── projects/page.tsx        # Full project listing
│   ├── cv/page.tsx              # CV/resume: download, JSON-LD structured data
│   └── contact/page.tsx         # GitHub + LinkedIn contact cards
├── components/
│   ├── ui/                      # Custom Protocol-styled primitives (button, card, badge, separator)
│   ├── header.tsx               # Sticky nav, theme toggle, mobile hamburger
│   ├── footer.tsx               # Social links + RSS + copyright
│   ├── theme-provider.tsx       # next-themes wrapper (client component)
│   ├── hero.tsx                 # Hero with name, intro, CTA buttons
│   ├── about.tsx                # Bio + Skills section
│   ├── skills.tsx               # Categorized skill badges with official icons
│   ├── projects-section.tsx     # Homepage project cards (2 featured)
│   ├── recent-posts.tsx         # Homepage latest 3 blog posts
│   ├── blog-card.tsx            # Reusable post card (linkable)
│   ├── blog-list.tsx            # Searchable post grid
│   ├── project-list.tsx         # Searchable GitHub project list
│   ├── post-header.tsx          # Post title, date, reading time, tags
│   ├── search-input.tsx         # Reusable search input
│   └── toc.tsx                  # IntersectionObserver-based table of contents
├── content/posts/               # Markdown blog posts with YAML frontmatter
│   ├── building-clean-nextjs-portfolio.md
│   ├── getting-started-with-typescript.md
│   └── why-i-love-tailwind-css.md
├── lib/
│   ├── utils.ts                 # cn() — clsx + tailwind-merge
│   ├── posts.ts                 # getAllPosts, getPostBySlug, getAllTags, getPostsByTag
│   ├── github.ts                # GitHub public repo fetcher
│   └── markdown.ts              # remark/rehype pipeline → HTML
└── types/
    ├── post.ts                  # Post, PostMeta, PostFrontmatter interfaces
    └── github.ts                # GitHubRepo interface
```

---

## Skills / Tech Stack

Displayed as categorized responsive cards with official Simple Icons.

### Languages
- **Java** — custom inline SVG (not in Simple Icons package)
- **JavaScript** — `SiJavascript` (Simple Icons)
- **TypeScript** — `SiTypescript` (Simple Icons)
- **HTML5** — `SiHtml5` (Simple Icons)
- **CSS3** — `SiCss` (Simple Icons)

### Frontend
- **React** — `SiReact` (Simple Icons)
- **Next.js** — `SiNextdotjs` (Simple Icons)
- **Tailwind CSS** — `SiTailwindcss` (Simple Icons)
- **Vite** — `SiVite` (Simple Icons)

### Backend
- **Spring Boot** — `SiSpringboot` (Simple Icons) + **"Learning" badge** (not professional experience)
- **REST APIs** — `Globe` (lucide-react)

### Tools
- **Git** — `SiGit`
- **GitHub** — `SiGithub`
- **Docker** — `SiDocker`
- **npm** — `SiNpm`
- **IntelliJ IDEA** — `SiIntellijidea`
- **VS Code** — custom inline SVG (not in Simple Icons package)

### Icon Package
Uses `@icons-pack/react-simple-icons` for all brand icons. Two icons (Java, VS Code) are inline SVGs because they are not available in the Simple Icons package. REST APIs uses `Globe` from `lucide-react` since it is a concept, not a brand.

---

## Blog System

### Frontmatter Format
```yaml
---
title: "Post Title"
description: "Brief description for cards and SEO"
date: YYYY-MM-DD
tags: [Tag1, Tag2, Tag3]
---
```

### Features
- **Static generation** — `generateStaticParams` for all posts and tags
- **Reading time** — calculated from word count (200 WPM, minimum 1 min)
- **Syntax highlighting** — code blocks via `rehype-pretty-code` (GitHub Dark Dimmed)
- **Table of Contents** — auto-generated from h2/h3 headings, IntersectionObserver for active tracking, only visible on `lg:` screens
- **Prev/Next navigation** — chronological at bottom of each post
- **Tag filtering** — `/blog/tag/[tag]` with counts on `/blog`
- **RSS feed** — `/api/rss` (XML, dynamic)
- **Sitemap** — `/sitemap.xml` (includes posts + tag pages)

### Adding a New Post
1. Create a `.md` file in `content/posts/`
2. Add YAML frontmatter with `title`, `description`, `date`, `tags`
3. Write content in Markdown (GFM supported)
4. Run `npm run build` — posts are statically generated automatically

---

## Design System

### Tokens
- **Design system:** Mozilla Protocol
- **Colors:** Mozilla palette — Ink 80 (`#20123a`) dark backgrounds, white light surfaces, Mozilla blue (`#0060df`) links, violet (`#9059ff`) focus ring, accessible contrast
- **Radius:** `0.25rem` base (sharp, utilitarian Protocol feel)
- **Fonts:** Inter (body), Zilla Slab (headings/display, Mozilla brand typeface), JetBrains Mono (code)
- **Borders:** Subtle `border-border` throughout
- **Shadows:** None — flat, border-based separation

### Typography System

Modern, editorial-inspired typography using Inter, Zilla Slab, and JetBrains Mono. All type is set with OpenType features (`calt`, `liga`, `kern`) for refined letterforms and ligatures.

**Zilla Slab** is used for headings and the header logotype — Mozilla's brand serif.

**Type Scale:**

| Token | Size | Line Height | Weight | Tracking | Usage |
|---|---|---|---|---|---|
| `text-5xl` | 3rem | 1.1 | 700 | -0.03em | Hero name (sm+) |
| `text-4xl` | 2.25rem | 1.15 | 700 | -0.03em | Blog post titles |
| `text-3xl` | 1.875rem | 1.2 | 700 | -0.03em | Page headings (h1) |
| `text-2xl` | 1.5rem | 1.25 | 700 | -0.02em | Section headings (h2) |
| `text-xl` | 1.25rem | 1.3 | 600 | -0.01em | Post h3, card titles |
| `text-lg` | 1.125rem | 1.7 | 500 | normal | Lead text, intro |
| `text-base` | 1rem | 1.7 | 400 | normal | Body copy |
| `text-sm` | 0.875rem | 1.55 | 400/500 | normal | Secondary body, nav |
| `text-xs` | 0.75rem | 1.5 | 400/500 | normal | Meta, captions |

**Color hierarchy for text:**
- `text-foreground` — headings, emphasis
- `text-foreground/88` — body copy (prose)
- `text-foreground/70` — secondary body (outside prose)
- `text-foreground/60` — descriptions, lead-in text
- `text-foreground/55` — low-emphasis metadata
- `text-muted-foreground` — tertiary, labels, badges

**Selection styles:**
- Light: Ink 80 at 12% opacity
- Dark: white at 18% opacity

### Prose (Blog Posts)
Custom `.prose-custom` class provides a premium reading experience:
- Body: `15px` (not `16px`) for better measure, `1.75` line-height
- H2: `1.625rem`, bold, `-0.015em` tracking, generous top margin
- H3: `1.25rem`, semibold, `-0.01em` tracking
- Paragraphs: `1.5rem` bottom margin for clear vertical rhythm
- Blockquotes: `3px` left border, normal (non-italic) style, muted color
- Links: medium weight, underline with custom offset, hover to full decoration
- Inline code: `0.875em` size, secondary background, 5px radius
- Code blocks: dark background (`#1d1133`), `13px` JetBrains Mono, `1.65` line-height
- Anchor links: hidden by default, fade in on heading hover
- First elements after headings collapse top margin for visual tightness

---

## Theming

- Uses `next-themes` with `attribute="class"` strategy
- `.dark` class toggles CSS custom property values
- **Color space:** hex-based Mozilla Protocol palette
- System preference via `enableSystem`
- `disableTransitionOnChange` is NOT used; a `beforeInteractive` script adds `no-theme-transition` on first paint to prevent hydration flash
- Theme toggle: Sun/Moon icons with rotation animation
- `suppressHydrationWarning` on `<html>` and toggle buttons
- `scroll-pt-14` on `<html>` ensures sticky header doesn't obscure scroll-to-anchor targets

---

## SEO

| Feature | Implementation |
|---|---|
| **Metadata** | Next.js `Metadata` API per page |
| **Open Graph** | Title, description, type, locale |
| **Article metadata** | Published time, tags on blog posts |
| **Sitemap** | Dynamic `sitemap.ts` covers all routes |
| **RSS** | `/api/rss` endpoint |
| **JSON-LD** | `schema.org/Person` structured data on `/cv` for AI/LLM crawlability |
| **Robots** | `index: true, follow: true` |
| **Canonical** | Via `metadataBase` |

---

## Deployment

### Vercel (Recommended)
```bash
npm run build   # verify production build
# Push to GitHub, import on vercel.com
```

The site uses a **hybrid** strategy:
- Static pages: `/`, `/blog`, `/blog/[slug]`, `/projects`, `/cv`, `/contact`
- Dynamic: `/api/rss` (serverless function)

### Environment Variables
None required. No database, no authentication, no external APIs at runtime.

---

## Conventions

### Components
- Server Components by default (no `"use client"` unless needed)
- Client Components: `header`, `toc`, `theme-provider`
- Named exports for section components, default export for pages
- Custom UI primitives in `components/ui/`

### Styling
- `cn()` helper for conditional classes
- Tailwind classes directly in JSX (no CSS modules)
- Prose styles in `globals.css` under `.prose-custom`
- Responsive: `sm:` breakpoint for 2-col grids, `lg:` for TOC sidebar

### Data
- No external data fetching at runtime
- Blog content loaded from `content/posts/` at build time
- TypeScript interfaces in `types/`

### Known Limitations
- GitHub/LinkedIn brand icons use inline SVG (lucide-react doesn't include brand icons in v1.28)
- Java and VS Code icons use inline SVG (not in `@icons-pack/react-simple-icons`)
- `rehype-pretty-code` uses `github-dark-dimmed` theme (works for both light/dark)

---

## Future Extensions

- Add more blog posts to `content/posts/`
- Add more projects to the projects data
- Consider adding a "Uses" page for detailed tooling
- Add RSS subscriber count (if desired)
- Configure a custom domain on Vercel
