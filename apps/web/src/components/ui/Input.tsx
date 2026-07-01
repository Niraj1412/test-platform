import type { InputHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-11 w-full rounded-md border border-border bg-card px-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15',
        className
      )}
      {...props}
    />
  )
}
