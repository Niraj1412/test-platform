import type { ReactNode } from 'react'

export function AuthLayout({ children }: { children: ReactNode }) {
  return <main className="grid min-h-screen place-items-center bg-background p-6">{children}</main>
}
