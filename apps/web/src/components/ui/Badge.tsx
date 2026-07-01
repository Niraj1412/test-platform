import type { HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

type BadgeTone = 'blue' | 'gray' | 'green' | 'orange' | 'red'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone
}

const tones: Record<BadgeTone, string> = {
  blue: 'bg-primary-soft text-primary',
  gray: 'bg-muted text-foreground',
  green: 'bg-success-soft text-success',
  orange: 'bg-warning-soft text-orange-700',
  red: 'bg-danger-soft text-danger'
}

export function Badge({ tone = 'gray', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex min-h-6 items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase',
        tones[tone],
        className
      )}
      {...props}
    />
  )
}
