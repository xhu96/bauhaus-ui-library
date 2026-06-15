import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { solidColor, type BauhausColor, type Size } from '@/lib/types'

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  /** Completion percentage, 0–100. Ignored when indeterminate. */
  value?: number
  color?: BauhausColor
  size?: Size
  /** Show the numeric percentage label. */
  showLabel?: boolean
  /** Render a looping indeterminate bar instead of a fixed value. */
  indeterminate?: boolean
}

const trackHeights: Record<Size, string> = {
  sm: 'h-3',
  md: 'h-5',
  lg: 'h-7',
}

/**
 * Determinate or indeterminate progress bar. Thick-bordered track with
 * a solid colored fill, sharp corners and an optional percentage label.
 */
export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  { value = 0, color = 'red', size = 'md', showLabel = false, indeterminate = false, className, ...props },
  ref,
) {
  const clamped = Math.max(0, Math.min(100, value))

  return (
    <div ref={ref} className={cn('flex items-center gap-3', className)} {...props}>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={indeterminate ? undefined : clamped}
        className={cn('relative w-full overflow-hidden border-3 border-ink bg-surface', trackHeights[size])}
      >
        {indeterminate ? (
          <div className={cn('absolute inset-y-0 left-0 w-1/3 animate-indeterminate', solidColor[color])} />
        ) : (
          <div
            className={cn('h-full transition-[width] duration-300 ease-out', solidColor[color])}
            style={{ width: `${clamped}%` }}
          />
        )}
      </div>
      {showLabel && !indeterminate && (
        <span className="w-10 shrink-0 text-right font-mono text-sm font-bold tabular-nums text-ink">
          {Math.round(clamped)}%
        </span>
      )}
    </div>
  )
})
