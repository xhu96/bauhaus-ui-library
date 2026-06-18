import { type AnchorHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface NavbarProps extends HTMLAttributes<HTMLElement> {
  /** Pin the bar to the top of the viewport. */
  sticky?: boolean
  children: ReactNode
}

/**
 * Top navigation bar with the Bauhaus thick bottom border on a paper surface.
 */
export function Navbar({ sticky = false, className, children, ...props }: NavbarProps) {
  return (
    <nav
      className={cn(
        'flex w-full items-center gap-6 border-b-3 border-ink bg-paper px-5 py-3',
        sticky && 'sticky top-0 z-40',
        className,
      )}
      {...props}
    >
      {children}
    </nav>
  )
}

/**
 * Left-aligned brand slot.
 */
export function NavbarBrand({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 font-display text-xl font-bold tracking-tight text-ink',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export interface NavbarContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Horizontal alignment of the content within its flex track. */
  justify?: 'start' | 'center' | 'end'
  children: ReactNode
}

const justifyMap: Record<NonNullable<NavbarContentProps['justify']>, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
}

/**
 * Flexible content slot, typically holding nav links. Grows to fill the bar.
 */
export function NavbarContent({ justify = 'end', className, children, ...props }: NavbarContentProps) {
  return (
    <div className={cn('flex min-w-0 flex-1 items-center gap-5', justifyMap[justify], className)} {...props}>
      {children}
    </div>
  )
}

export interface NavbarLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string
  active?: boolean
  children: ReactNode
}

/**
 * Navigation link. Active links are underlined and inked; others are muted.
 */
export function NavbarLink({ href, active = false, className, children, ...props }: NavbarLinkProps) {
  return (
    <a
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'press font-display text-sm font-semibold uppercase tracking-wide',
        active ? 'text-ink underline decoration-3 underline-offset-4' : 'text-ink-muted hover:text-ink',
        className,
      )}
      {...props}
    >
      {children}
    </a>
  )
}
