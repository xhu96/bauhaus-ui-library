import { type SVGProps } from 'react'
import { cn } from '@/lib/utils'
import { type BauhausColor } from '@/lib/types'

export type ShapeKind =
  | 'circle'
  | 'square'
  | 'triangle'
  | 'semicircle'
  | 'quarter'
  | 'ring'
  | 'diamond'
  | 'cross'
  | 'arc'

export interface ShapeProps extends Omit<SVGProps<SVGSVGElement>, 'color'> {
  /** Which geometric primitive to draw. */
  kind?: ShapeKind
  /** Fill color from the Bauhaus palette. */
  color?: BauhausColor
  /** Pixel size of the square viewbox. */
  size?: number
  /** Outline instead of solid fill. */
  outline?: boolean
}

/** Text-color class per palette name. `ink` is variable-backed so it flips in dark mode. */
const colorClass: Record<BauhausColor, string> = {
  red: 'text-bred',
  blue: 'text-bblue',
  yellow: 'text-byellow',
  ink: 'text-ink',
}

/**
 * A single Bauhaus geometric primitive rendered as crisp SVG. Uses `currentColor`
 * so the `ink` variant adapts to light/dark mode. The building block for logos,
 * decorations and the GeometricPattern.
 */
export function Shape({
  kind = 'circle',
  color = 'ink',
  size = 40,
  outline = false,
  className,
  ...props
}: ShapeProps) {
  const fill = outline ? 'none' : 'currentColor'
  const stroke = outline ? 'currentColor' : 'none'
  const sw = outline ? 6 : 0

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={cn('inline-block shrink-0', colorClass[color], className)}
      aria-hidden="true"
      {...props}
    >
      {kind === 'circle' && <circle cx="50" cy="50" r="46" fill={fill} stroke={stroke} strokeWidth={sw} />}
      {kind === 'square' && <rect x="6" y="6" width="88" height="88" fill={fill} stroke={stroke} strokeWidth={sw} />}
      {kind === 'triangle' && (
        <polygon points="50,3 98,93 2,93" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
      )}
      {kind === 'diamond' && (
        <polygon points="50,4 96,50 50,96 4,50" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
      )}
      {kind === 'semicircle' && (
        <path d="M4 50 A46 46 0 0 1 96 50 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
      )}
      {kind === 'quarter' && (
        <path d="M6 6 L6 94 A88 88 0 0 0 94 6 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
      )}
      {kind === 'arc' && <path d="M8 94 A86 86 0 0 1 94 8" fill="none" stroke="currentColor" strokeWidth={14} />}
      {kind === 'ring' && <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth={14} />}
      {kind === 'cross' && (
        <g fill="currentColor">
          <rect x="40" y="6" width="20" height="88" />
          <rect x="6" y="40" width="88" height="20" />
        </g>
      )}
    </svg>
  )
}
