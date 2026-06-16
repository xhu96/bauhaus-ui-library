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

const EDGE = 4
const FAR_EDGE = 100 - EDGE
const MID = 50
const FULL_SPAN = FAR_EDGE - EDGE
const CIRCLE_RADIUS = MID - EDGE
const STROKE_WIDTH = 14
const STROKED_RADIUS = CIRCLE_RADIUS - STROKE_WIDTH / 2
const BAR_WIDTH = 16
const BAR_START = MID - BAR_WIDTH / 2
const ARC_CENTER = FAR_EDGE - STROKE_WIDTH / 2
const ARC_RADIUS = ARC_CENTER - (EDGE + STROKE_WIDTH / 2)

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
      {kind === 'circle' && (
        <circle cx={MID} cy={MID} r={CIRCLE_RADIUS} fill={fill} stroke={stroke} strokeWidth={sw} />
      )}
      {kind === 'square' && (
        <rect x={EDGE} y={EDGE} width={FULL_SPAN} height={FULL_SPAN} fill={fill} stroke={stroke} strokeWidth={sw} />
      )}
      {kind === 'triangle' && (
        <polygon
          points={`${MID},${EDGE} ${FAR_EDGE},${FAR_EDGE} ${EDGE},${FAR_EDGE}`}
          fill={fill}
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin="round"
        />
      )}
      {kind === 'diamond' && (
        <polygon
          points={`${MID},${EDGE} ${FAR_EDGE},${MID} ${MID},${FAR_EDGE} ${EDGE},${MID}`}
          fill={fill}
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin="round"
        />
      )}
      {kind === 'semicircle' && (
        <path
          d={`M${EDGE} ${MID} A${CIRCLE_RADIUS} ${CIRCLE_RADIUS} 0 0 1 ${FAR_EDGE} ${MID} Z`}
          fill={fill}
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin="round"
        />
      )}
      {kind === 'quarter' && (
        <path
          d={`M${EDGE} ${EDGE} L${EDGE} ${FAR_EDGE} A${FULL_SPAN} ${FULL_SPAN} 0 0 0 ${FAR_EDGE} ${EDGE} Z`}
          fill={fill}
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin="round"
        />
      )}
      {kind === 'arc' && (
        <path
          d={`M${EDGE + STROKE_WIDTH / 2} ${ARC_CENTER} A${ARC_RADIUS} ${ARC_RADIUS} 0 0 1 ${ARC_CENTER} ${
            EDGE + STROKE_WIDTH / 2
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth={STROKE_WIDTH}
        />
      )}
      {kind === 'ring' && (
        <circle
          cx={MID}
          cy={MID}
          r={STROKED_RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth={STROKE_WIDTH}
        />
      )}
      {kind === 'cross' && (
        <g fill="currentColor">
          <rect x={BAR_START} y={EDGE} width={BAR_WIDTH} height={FULL_SPAN} />
          <rect x={EDGE} y={BAR_START} width={FULL_SPAN} height={BAR_WIDTH} />
        </g>
      )}
    </svg>
  )
}
