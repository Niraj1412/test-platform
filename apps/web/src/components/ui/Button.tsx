import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '../../utils/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface BaseButtonProps {
  variant?: ButtonVariant
  icon?: ReactNode
  className?: string
  children?: ReactNode
}

type NativeButtonProps = BaseButtonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined }
type LinkButtonProps = BaseButtonProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { href: string }
type ButtonProps = NativeButtonProps | LinkButtonProps

const variants: Record<ButtonVariant, string> = {
  primary: 'border-primary bg-primary text-primary-foreground hover:bg-blue-700',
  secondary: 'border-border bg-card text-foreground hover:bg-muted',
  ghost: 'border-transparent bg-transparent text-foreground hover:bg-muted',
  danger: 'border-danger bg-danger text-white hover:bg-red-700'
}

function isLinkButton(props: ButtonProps): props is LinkButtonProps {
  return typeof props.href === 'string'
}

export function Button(props: ButtonProps) {
  const { variant = 'primary', icon, className, children } = props
  const classes = cn(
    'inline-flex h-11 items-center justify-center gap-2 rounded-md border px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50',
    variants[variant],
    className
  )

  if (isLinkButton(props)) {
    const { variant: omittedVariant, icon: omittedIcon, className: omittedClassName, children: omittedChildren, href, ...linkProps } = props
    void omittedVariant
    void omittedIcon
    void omittedClassName
    void omittedChildren
    return (
      <Link className={classes} href={href} {...linkProps}>
        {icon}
        {children}
      </Link>
    )
  }

  const { variant: omittedVariant, icon: omittedIcon, className: omittedClassName, children: omittedChildren, ...buttonProps } = props
  void omittedVariant
  void omittedIcon
  void omittedClassName
  void omittedChildren

  return (
    <button
      className={classes}
      {...buttonProps}
    >
      {icon}
      {children}
    </button>
  )
}
