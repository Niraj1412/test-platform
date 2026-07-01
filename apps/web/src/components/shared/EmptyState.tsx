import type { ReactNode } from 'react'

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-md border border-dashed border-border bg-card p-8 text-center">
      <h3 className="font-bold">{title}</h3>
      {children && <div className="mt-2 text-sm text-muted-foreground">{children}</div>}
    </div>
  )
}
