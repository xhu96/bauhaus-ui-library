import { type SVGProps } from 'react'
import { cn } from '@/lib/utils'
import { hex, type BauhausColor, type Size } from '@/lib/types'

export interface SpinnerProps extends Omit<SVGProps<SVGSVGElement>, 'color'> {
  size?: Size | number
  color?: BauhausColor
  /** Accessible label announced to screen readers. */
  label?: string
}

const sizePx: Record<Size, number> = {
  sm: 18,
  md: 28,
  lg: 40,
}

/**
 * Bauhaus loader: a rotating quarter-circle arc with a counter-rotating
 * dot orbiting inside. Inline SVG, announced as a status region.
 */
export function Spinner({
  size = 'md',
  color = 'ink',
  label = 'Loading',
  className,
  ...props
}: SpinnerProps) {
  const px = typeof size === 'number' ? size : sizePx[size]
  const c = hex[color]

  return (
    <span role="status" aria-label={label} className="inline-flex">
      <svg
        width={px}
        height={px}
        viewBox="0 0 100 100"
        className={cn('inline-block shrink-0', className)}
        aria-hidden="true"
        {...props}
      >
        {/* Rotating quarter-circle arc */}
        <g className="origin-center animate-spin" style={{ transformBox: 'fill-box' }}>
          <path d="M50 8 A42 42 0 0 1 92 50" fill="none" stroke={c} strokeWidth={14} strokeLinecap="square" />
        </g>
        {/* Counter-rotating orbiting dot */}
        <g
          className="origin-center animate-spin-slow"
          style={{ transformBox: 'fill-box', animationDirection: 'reverse' }}
        >
          <rect x="44" y="74" width="14" height="14" fill={c} />
        </g>
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  )
}
