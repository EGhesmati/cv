import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center py-32">
      <div className="mx-auto max-w-xl px-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          404
        </p>
        <h1 className="mt-3 text-2xl font-bold tracking-[-0.02em] text-foreground">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-foreground/55 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-9 items-center justify-center rounded-sm bg-foreground px-4 text-sm font-medium text-background transition-colors hover:opacity-90"
        >
          Go home
        </Link>
      </div>
    </div>
  )
}
