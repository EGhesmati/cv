export default function Loading() {
  return (
    <div className="section-wrap">
      <div className="layout-shell animate-pulse space-y-6">
        <div className="font-mono text-sm text-muted-foreground mb-4 flex gap-1">
          <div className="h-4 w-24 rounded-sm bg-secondary" />
          <div className="h-4 w-3 rounded-sm bg-secondary" />
          <div className="h-4 w-16 rounded-sm bg-secondary" />
          <div className="h-4 w-3 rounded-sm bg-secondary" />
          <div className="h-4 w-20 rounded-sm bg-secondary" />
        </div>
        <div className="h-10 w-2/3 max-w-md rounded-sm bg-secondary" />
        <div className="space-y-3 pt-2">
          <div className="h-4 w-full max-w-xl rounded-sm bg-secondary" />
          <div className="h-4 w-5/6 max-w-lg rounded-sm bg-secondary" />
          <div className="h-4 w-1/2 max-w-sm rounded-sm bg-secondary" />
        </div>
      </div>
    </div>
  )
}
