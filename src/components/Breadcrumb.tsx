import { Children, Fragment, isValidElement, type ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface BreadcrumbProps {
  /** Node inserted between items. Defaults to a small chevron. */
  separator?: ReactNode
  children: ReactNode
  className?: string
}

/**
 * Semantic breadcrumb trail. Renders an ordered list inside a labelled nav and
 * inserts the separator between items.
 */
export function Breadcrumb({ separator, children, className }: BreadcrumbProps) {
  const sep = separator ?? <ChevronRight className="h-4 w-4 text-ink-muted" aria-hidden />
  const items = Children.toArray(children).filter(isValidElement)

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-2 font-display text-sm uppercase tracking-wide">
        {items.map((child, i) => (
          <Fragment key={i}>
            {child}
            {i < items.length - 1 && (
              <li aria-hidden className="inline-flex items-center">
                {sep}
              </li>
            )}
          </Fragment>
        ))}
      </ol>
    </nav>
  )
}

export interface BreadcrumbItemProps {
  href?: string
  /** Marks the final/current crumb. Renders as bold text, not a link. */
  current?: boolean
  children: ReactNode
  className?: string
}

/**
 * A single crumb. The current crumb is bold and inert; others are links.
 */
export function BreadcrumbItem({ href, current = false, children, className }: BreadcrumbItemProps) {
  return (
    <li className={cn('inline-flex items-center', className)}>
      {current ? (
        <span aria-current="page" className="font-bold text-ink">
          {children}
        </span>
      ) : (
        <a
          href={href}
          className="press font-semibold text-ink-muted underline-offset-4 hover:text-ink hover:underline"
        >
          {children}
        </a>
      )}
    </li>
  )
}
