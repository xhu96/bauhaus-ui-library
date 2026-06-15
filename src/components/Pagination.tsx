import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { solidColor, type BauhausColor } from '@/lib/types'

export interface PaginationProps {
  /** Current page, 1-based. */
  page: number
  /** Total number of pages. */
  count: number
  onPageChange: (page: number) => void
  /** Pages shown on each side of the current page. */
  siblingCount?: number
  /** Fill color for the active page. */
  color?: BauhausColor
  className?: string
}

const ELLIPSIS = 'ellipsis'

function range(start: number, end: number): number[] {
  const out: number[] = []
  for (let i = start; i <= end; i++) out.push(i)
  return out
}

/**
 * Builds the list of page items, inserting ellipsis markers where the range is
 * truncated. Always shows the first and last page.
 */
function buildItems(page: number, count: number, siblingCount: number): (number | typeof ELLIPSIS)[] {
  // first + last + current + 2*siblings + 2 ellipsis slots
  const totalSlots = siblingCount * 2 + 5
  if (count <= totalSlots) {
    return range(1, count)
  }

  const leftSibling = Math.max(page - siblingCount, 1)
  const rightSibling = Math.min(page + siblingCount, count)

  const showLeftEllipsis = leftSibling > 2
  const showRightEllipsis = rightSibling < count - 1

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftItemCount = siblingCount * 2 + 3
    return [...range(1, leftItemCount), ELLIPSIS, count]
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightItemCount = siblingCount * 2 + 3
    return [1, ELLIPSIS, ...range(count - rightItemCount + 1, count)]
  }

  return [1, ELLIPSIS, ...range(leftSibling, rightSibling), ELLIPSIS, count]
}

/**
 * Bauhaus pagination: square bordered Prev/Next controls and numbered page
 * buttons with ellipsis truncation. The active page fills with a solid color.
 */
export function Pagination({
  page,
  count,
  onPageChange,
  siblingCount = 1,
  color = 'ink',
  className,
}: PaginationProps) {
  if (count <= 0) return null

  const items = buildItems(page, count, siblingCount)
  const atStart = page <= 1
  const atEnd = page >= count

  const squareBase =
    'press inline-flex h-10 w-10 shrink-0 items-center justify-center border-3 border-ink bg-surface font-display text-sm font-semibold text-ink'

  return (
    <nav aria-label="Pagination" className={cn('flex items-center gap-2', className)}>
      <button
        type="button"
        aria-label="Go to previous page"
        disabled={atStart}
        onClick={() => onPageChange(page - 1)}
        className={cn(
          squareBase,
          'press-hard hover:bg-paper-dark disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none',
        )}
      >
        <ChevronLeft className="h-5 w-5" aria-hidden />
      </button>

      {items.map((item, i) => {
        if (item === ELLIPSIS) {
          return (
            <span
              key={`ellipsis-${i}`}
              aria-hidden
              className="inline-flex h-10 w-10 items-center justify-center font-display text-sm font-semibold text-ink-muted"
            >
              &hellip;
            </span>
          )
        }

        const isActive = item === page
        return (
          <button
            key={item}
            type="button"
            aria-label={`Go to page ${item}`}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onPageChange(item)}
            className={cn(
              squareBase,
              'press-hard',
              isActive ? cn(solidColor[color], 'shadow-hard') : 'hover:bg-paper-dark',
            )}
          >
            {item}
          </button>
        )
      })}

      <button
        type="button"
        aria-label="Go to next page"
        disabled={atEnd}
        onClick={() => onPageChange(page + 1)}
        className={cn(
          squareBase,
          'press-hard hover:bg-paper-dark disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none',
        )}
      >
        <ChevronRight className="h-5 w-5" aria-hidden />
      </button>
    </nav>
  )
}
