import { forwardRef, type HTMLAttributes } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { solidColor, hex, type BauhausColor } from '@/lib/types'

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  color?: BauhausColor
  /** When provided, renders an accessible remove (X) button. */
  onRemove?: () => void
  /** Show a leading colored square. */
  dot?: boolean
}

/**
 * Interactive label. Like Badge but supports a leading color dot
 * and an optional accessible remove button.
 */
export const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag(
  { color = 'ink', onRemove, dot = false, className, children, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center gap-1.5 border-3 border-ink bg-surface px-2 font-display text-sm font-semibold leading-none text-ink',
        onRemove ? 'min-h-11' : 'h-7',
        className,
      )}
      {...props}
    >
      {dot && (
        <span
          aria-hidden="true"
          className="h-2.5 w-2.5 shrink-0 border border-ink"
          style={{ backgroundColor: hex[color] }}
        />
      )}
      {children}
      {onRemove && (
        <button
          type="button"
          aria-label="Remove"
          onClick={onRemove}
          className={cn(
            'press -mr-1 ml-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center border border-ink',
            solidColor[color],
            'hover:opacity-80',
          )}
        >
          <X className="h-3 w-3" aria-hidden />
        </button>
      )}
    </span>
  )
})
