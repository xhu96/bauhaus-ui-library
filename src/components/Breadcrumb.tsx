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
  const sep = separator ?? (
    <ChevronRight className="bui-reset bui-h-4 bui-w-4 bui-text-ink-muted" aria-hidden />
  )
  const items = Children.toArray(children).filter(isValidElement)

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="bui-reset bui-m-0 bui-flex bui-list-none bui-flex-wrap bui-items-center bui-gap-2 bui-p-0 bui-font-display bui-text-sm bui-uppercase bui-tracking-wide">
        {items.map((child, i) => (
          <Fragment key={i}>
            {child}
            {i < items.length - 1 && (
              <li aria-hidden className="bui-reset bui-inline-flex bui-items-center">
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
    <li className={cn('bui-reset', 'bui-inline-flex bui-items-center', className)}>
      {current ? (
        <span aria-current="page" className="bui-reset bui-font-bold bui-text-ink">
          {children}
        </span>
      ) : (
        <a
          href={href}
          className="bui-reset bui-press bui-font-semibold bui-text-ink-muted bui-underline-offset-4 hover:bui-text-ink hover:bui-underline"
        >
          {children}
        </a>
      )}
    </li>
  )
}
