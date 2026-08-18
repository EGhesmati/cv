---
title: "Building a Clean Next.js Portfolio"
description: "Learn how I built this minimalist portfolio using Next.js 15, TypeScript, Tailwind CSS, and the Mozilla Protocol design system with a focus on performance and readability."
date: 2025-01-15
tags: [Next.js, TypeScript, Tailwind CSS, Portfolio]
---

## Why Build a Portfolio?

Every developer needs a portfolio. It's your digital home on the internet — a place to showcase your work, share your thoughts, and connect with others in the community.

## Design Philosophy

When I set out to build this portfolio, I had a few key principles in mind:

- **Minimalism**: Less is more. Plenty of whitespace lets content breathe.
- **Typography-first**: Good fonts and proper spacing make reading effortless.
- **Dark mode**: Respecting user preferences with system-aware theming.
- **Performance**: Fast loads and zero unnecessary JavaScript.

## Tech Stack Choices

### Next.js App Router

Next.js with the App Router provides excellent developer experience with built-in routing, layouts, and static generation capabilities. It's the perfect choice for a content-focused portfolio.

```typescript
// Static generation for blog posts
export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}
```

### Tailwind CSS & Mozilla Protocol

Tailwind CSS offers utility-first styling that keeps CSS bundles small. I paired it with the Mozilla Protocol design system for a bold, accessible palette and clean component conventions.

### Markdown for Content

Using Markdown for blog posts means content is portable, version-controllable, and easy to write. With frontmatter support, each post carries its own metadata.

## Key Features

1. **Static generation** for all blog posts
2. **RSS feed** for subscribers
3. **SEO metadata** for better discoverability
4. **Reading time** estimates
5. **Syntax highlighting** for code blocks
6. **Tag-based filtering**
7. **Table of contents** for longer posts

## Conclusion

Building a portfolio is a great way to experiment with new technologies while creating something useful. This project uses a clean, maintainable stack that's easy to deploy and extend.

If you're interested in the source code, check out the [GitHub repository](https://github.com/EGhesmati).
