import { cn } from '../../utils/cn'

interface MaterialIconProps {
  name: string
  className?: string
  fill?: boolean
}

export function MaterialIcon({ name, className, fill = false }: MaterialIconProps) {
  return (
    <span className={cn('material-symbols-outlined', fill && 'fill', className)} aria-hidden="true">
      {name}
    </span>
  )
}
