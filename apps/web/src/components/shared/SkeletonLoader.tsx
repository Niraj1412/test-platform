export function SkeletonLoader() {
  return (
    <div className="space-y-3">
      <div className="h-8 w-1/3 animate-pulse rounded bg-muted" />
      <div className="h-24 animate-pulse rounded bg-muted" />
      <div className="h-24 animate-pulse rounded bg-muted" />
    </div>
  )
}
