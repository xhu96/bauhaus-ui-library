import { forwardRef, type HTMLAttributes } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { solidColor, hex, type BauhausColor } from '@/lib/types'

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  color?: BauhausColor
  /** When provided, renders an accessible remove (X) button. */
  onRemove?: () => void
  /** Translated remove button label. Defaults to Remove. */
  removeLabel?: string
  /** Show a leading colored square. */
  dot?: boolean
}

/**
 * Interactive label. Like Badge but supports a leading color dot
 * and an optional accessible remove button.
 */
export const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag(
  { color = 'ink', onRemove, removeLabel = 'Remove', dot = false, className, children, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn(
        'bui-reset',
        'bui-inline-flex bui-items-center bui-gap-1.5 bui-border-3 bui-border-ink bui-bg-surface bui-px-2 bui-font-display bui-text-sm bui-font-semibold bui-leading-none bui-text-ink',
        onRemove ? 'bui-min-h-11' : 'bui-h-7',
        className,
      )}
      {...props}
    >
      {dot && (
        <span
          aria-hidden="true"
          className="bui-reset bui-h-2.5 bui-w-2.5 bui-shrink-0 bui-border bui-border-ink"
          style={{ backgroundColor: color === 'ink' ? 'rgb(var(--bui-ink))' : hex[color] }}
        />
      )}
      {children}
      {onRemove && (
        <button
          type="button"
          aria-label={removeLabel}
          onClick={onRemove}
          className={cn(
            'bui-reset',
            'bui-press -bui-me-1 bui-ms-0.5 bui-inline-flex bui-h-8 bui-w-8 bui-shrink-0 bui-items-center bui-justify-center bui-border bui-border-ink',
            solidColor[color],
            'hover:bui-opacity-80',
          )}
        >
          <X className="bui-reset bui-h-3 bui-w-3" aria-hidden />
        </button>
      )}
    </span>
  )
})
