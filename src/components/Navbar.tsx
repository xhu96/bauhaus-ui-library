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
        'bui-reset',
        'bui-flex bui-w-full bui-items-center bui-gap-6 bui-border-b-3 bui-border-ink bui-bg-paper bui-px-5 bui-py-3',
        sticky && 'bui-sticky bui-top-0 bui-z-40',
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
        'bui-reset',
        'bui-flex bui-items-center bui-gap-2 bui-font-display bui-text-xl bui-font-bold bui-tracking-tight bui-text-ink',
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
  start: 'bui-justify-start',
  center: 'bui-justify-center',
  end: 'bui-justify-end',
}

/**
 * Flexible content slot, typically holding nav links. Grows to fill the bar.
 */
export function NavbarContent({ justify = 'end', className, children, ...props }: NavbarContentProps) {
  return (
    <div
      className={cn(
        'bui-reset',
        'bui-flex bui-min-w-0 bui-flex-1 bui-items-center bui-gap-5',
        justifyMap[justify],
        className,
      )}
      {...props}
    >
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
        'bui-reset',
        'bui-press bui-font-display bui-text-sm bui-font-semibold bui-uppercase bui-tracking-wide',
        active
          ? 'bui-text-ink bui-underline decoration-3 bui-underline-offset-4'
          : 'bui-text-ink-muted hover:bui-text-ink',
        className,
      )}
      {...props}
    >
      {children}
    </a>
  )
}
