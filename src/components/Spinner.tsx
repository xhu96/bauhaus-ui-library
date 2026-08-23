import { type SVGProps } from 'react'
import { cn } from '@/lib/utils'
import { hex, type BauhausColor, type Size } from '@/lib/types'

export interface SpinnerProps extends Omit<SVGProps<SVGSVGElement>, 'color'> {
  size?: Size | number
  color?: BauhausColor
  /** Accessible label announced to screen readers. */
  label?: string
  /** Hide the spinner from assistive technology when another control already communicates loading state. */
  decorative?: boolean
}

const sizePx: Record<Size, number> = {
  sm: 18,
  md: 28,
  lg: 40,
}

/**
 * Bauhaus loader: a single rotating three-quarter ring with a deliberate gap
 * and square-cut ends. Inline SVG, announced as a status region by default.
 */
export function Spinner({
  size = 'md',
  color = 'ink',
  label = 'Loading',
  decorative = false,
  className,
  style,
  ...props
}: SpinnerProps) {
  const px = typeof size === 'number' ? size : sizePx[size]
  const c = color === 'ink' ? 'currentColor' : hex[color]

  return (
    <span
      role={decorative ? undefined : 'status'}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative ? 'true' : undefined}
      className="bui-reset bui-inline-flex"
    >
      <svg
        width={px}
        height={px}
        viewBox="0 0 100 100"
        className={cn(
          'bui-reset bui-inline-block bui-shrink-0 bui-origin-center bui-animate-spin',
          color === 'ink' && 'bui-text-ink',
          className,
        )}
        style={{ transformBox: 'fill-box', ...style }}
        aria-hidden="true"
        {...props}
      >
        <circle
          cx="50"
          cy="50"
          r="38"
          fill="none"
          stroke={c}
          strokeWidth="14"
          strokeLinecap="square"
          pathLength="100"
          strokeDasharray="72 28"
        />
      </svg>
      {!decorative && <span className="bui-reset bui-sr-only">{label}</span>}
    </span>
  )
}
