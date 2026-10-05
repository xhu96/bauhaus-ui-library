import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { solidColor, type BauhausColor, type Size } from '@/lib/types'

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  /** Completion percentage, clamped to 0–100; nonfinite values become 0. Ignored when indeterminate. */
  value?: number
  color?: BauhausColor
  size?: Size
  /** Show the numeric percentage label. */
  showLabel?: boolean
  /** Render a looping indeterminate bar instead of a fixed value. */
  indeterminate?: boolean
}

const trackHeights: Record<Size, string> = {
  sm: 'bui-h-3',
  md: 'bui-h-5',
  lg: 'bui-h-7',
}

/**
 * Determinate or indeterminate progress bar. Thick-bordered track with
 * a solid colored fill, sharp corners and an optional percentage label.
 * Native attributes and ref target the progressbar; className styles its
 * layout wrapper. Supply aria-label or aria-labelledby for an accessible name.
 */
export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  { value = 0, color = 'red', size = 'md', showLabel = false, indeterminate = false, className, ...props },
  ref,
) {
  const clamped = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0

  return (
    <div className={cn('bui-reset', 'bui-flex bui-items-center bui-gap-3', className)}>
      <div
        {...props}
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={indeterminate ? undefined : clamped}
        className={cn(
          'bui-reset',
          'bui-relative bui-w-full bui-overflow-hidden bui-border-3 bui-border-ink bui-bg-surface',
          trackHeights[size],
        )}
      >
        {indeterminate ? (
          <div
            className={cn(
              'bui-reset',
              'bui-absolute bui-inset-y-0 bui-left-0 bui-w-1/3 bui-animate-indeterminate',
              solidColor[color],
            )}
          />
        ) : (
          <div
            className={cn(
              'bui-reset',
              'bui-h-full bui-transition-[width] bui-duration-300 bui-ease-out',
              solidColor[color],
            )}
            style={{ width: `${clamped}%` }}
          />
        )}
      </div>
      {showLabel && !indeterminate && (
        <span className="bui-reset bui-w-10 bui-shrink-0 bui-text-right bui-font-mono bui-text-sm bui-font-bold bui-tabular-nums bui-text-ink">
          {Math.round(clamped)}%
        </span>
      )}
    </div>
  )
})
