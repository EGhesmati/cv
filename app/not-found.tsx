import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center py-32">
      <div className="mx-auto max-w-xl px-4 text-center">
        <div className="font-mono text-sm text-muted-foreground mb-4">
          <span className="text-gh-green">erfan@dev</span>
          <span className="text-muted-foreground">:</span>
          <span className="text-gh-blue">~</span>
          <span className="text-foreground">$ </span>
          <span className="text-foreground">page-not-found</span>
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gh-red">
          404 — command not found
        </p>
        <h1 className="mt-3 text-2xl font-bold tracking-[-0.02em] text-foreground">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-foreground/55 leading-relaxed font-mono">
          zsh: no such file or directory
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 font-mono text-sm text-gh-green border border-gh-green/30 rounded-sm px-4 py-2 hover:bg-gh-green/10 transition-colors no-underline"
        >
          <span className="text-gh-green/60">$</span> cd ~
        </Link>
      </div>
    </div>
  )
}
