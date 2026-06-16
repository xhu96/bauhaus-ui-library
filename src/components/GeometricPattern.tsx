import { useMemo, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type ColorKey = 'red' | 'blue' | 'yellow' | 'ink' | 'paper' | 'white'

const COLORS: Record<ColorKey, string> = {
  red: '#E63329',
  blue: '#21409A',
  yellow: '#F4C20D',
  ink: '#1C1C1C',
  paper: '#F3EFE6',
  white: '#FFFFFF',
}

type Motif = 'full' | 'half' | 'quarter' | 'triangle' | 'diagonal' | 'dot' | 'plus' | 'ring' | 'leaf'
const MOTIFS: Motif[] = ['full', 'half', 'quarter', 'triangle', 'diagonal', 'dot', 'plus', 'ring', 'leaf']

const TILE_EDGE = 4
const TILE_END = 100 - TILE_EDGE
const TILE_MID = 50
const TILE_SPAN = TILE_END - TILE_EDGE
const TILE_RADIUS = TILE_MID - TILE_EDGE
const TILE_STROKE_WIDTH = 14
const TILE_STROKED_RADIUS = TILE_RADIUS - TILE_STROKE_WIDTH / 2
const TILE_DOT_RADIUS = 18
const TILE_BAR_WIDTH = 16
const TILE_BAR_START = TILE_MID - TILE_BAR_WIDTH / 2

export interface GeometricPatternProps extends HTMLAttributes<HTMLDivElement> {
  rows?: number
  cols?: number
  /** Shape colors drawn on each tile. */
  palette?: ColorKey[]
  /** Tile background colors. */
  surfaces?: ColorKey[]
  /** Change the seed to get a different (but stable) composition. */
  seed?: number
  /** Draw thin grid lines between tiles. */
  bordered?: boolean
}

/** Deterministic PRNG so a given seed always renders the same pattern. */
function mulberry32(a: number) {
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function Tile({ motif, fg, rot }: { motif: Motif; fg: string; rot: number }) {
  const g = (children: React.ReactNode) => <g transform={`rotate(${rot} 50 50)`}>{children}</g>
  switch (motif) {
    case 'full':
      return <circle cx={TILE_MID} cy={TILE_MID} r={TILE_RADIUS} fill={fg} />
    case 'dot':
      return <circle cx={TILE_MID} cy={TILE_MID} r={TILE_DOT_RADIUS} fill={fg} />
    case 'ring':
      return (
        <circle
          cx={TILE_MID}
          cy={TILE_MID}
          r={TILE_STROKED_RADIUS}
          fill="none"
          stroke={fg}
          strokeWidth={TILE_STROKE_WIDTH}
        />
      )
    case 'half':
      return g(
        <path
          d={`M${TILE_EDGE} ${TILE_END} A${TILE_RADIUS} ${TILE_RADIUS} 0 0 1 ${TILE_END} ${TILE_END} Z`}
          fill={fg}
        />,
      )
    case 'quarter':
      return g(
        <path
          d={`M${TILE_EDGE} ${TILE_EDGE} A${TILE_SPAN} ${TILE_SPAN} 0 0 1 ${TILE_END} ${TILE_END} L${TILE_EDGE} ${TILE_END} Z`}
          fill={fg}
        />,
      )
    case 'triangle':
      return g(
        <polygon points={`${TILE_EDGE},${TILE_END} ${TILE_END},${TILE_END} ${TILE_EDGE},${TILE_EDGE}`} fill={fg} />,
      )
    case 'diagonal':
      return g(
        <polygon points={`${TILE_EDGE},${TILE_EDGE} ${TILE_END},${TILE_EDGE} ${TILE_EDGE},${TILE_END}`} fill={fg} />,
      )
    case 'plus':
      return (
        <g fill={fg}>
          <rect x={TILE_BAR_START} y={TILE_EDGE} width={TILE_BAR_WIDTH} height={TILE_SPAN} />
          <rect x={TILE_EDGE} y={TILE_BAR_START} width={TILE_SPAN} height={TILE_BAR_WIDTH} />
        </g>
      )
    case 'leaf':
      return (
        <g fill={fg}>
          <path
            d={`M${TILE_EDGE} ${TILE_EDGE} A${TILE_SPAN} ${TILE_SPAN} 0 0 0 ${TILE_END} ${TILE_END} L${TILE_EDGE} ${TILE_END} Z`}
          />
          <path
            d={`M${TILE_END} ${TILE_END} A${TILE_SPAN} ${TILE_SPAN} 0 0 0 ${TILE_EDGE} ${TILE_EDGE} L${TILE_END} ${TILE_EDGE} Z`}
          />
        </g>
      )
  }
}

/**
 * The signature Bauhaus motif generator. Tessellates a grid of geometric tiles
 * (circles, arcs, triangles, quarter-circles…) using a seeded RNG so output is
 * deterministic. Use it as a hero backdrop, card decoration or section divider.
 */
export function GeometricPattern({
  rows = 4,
  cols = 8,
  palette = ['blue', 'red', 'yellow', 'ink'],
  surfaces = ['paper', 'white'],
  seed = 7,
  bordered = false,
  className,
  ...props
}: GeometricPatternProps) {
  const cells = useMemo(() => {
    const rand = mulberry32(seed * 2654435761)
    const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)]
    const out: { bg: string; fg: string; motif: Motif; rot: number }[] = []
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const bgKey = rand() < 0.72 ? pick(surfaces) : pick(palette)
        let fgKey = pick(palette)
        let guard = 0
        while (fgKey === bgKey && guard++ < 6) fgKey = pick([...palette, ...surfaces])
        out.push({
          bg: COLORS[bgKey],
          fg: COLORS[fgKey],
          motif: pick(MOTIFS),
          rot: pick([0, 90, 180, 270]),
        })
      }
    }
    return out
  }, [rows, cols, palette, surfaces, seed])

  // A real CSS grid of square tiles: always pixel-aligned, never cropped or
  // distorted, at any container width. Each tile is its own square SVG.
  return (
    <div
      className={cn('grid w-full', className)}
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      aria-hidden="true"
      {...props}
    >
      {cells.map((cell, i) => (
        <svg key={i} viewBox="0 0 100 100" className="block aspect-square w-full">
          <rect x="-0.5" y="-0.5" width="101" height="101" fill={cell.bg} />
          <Tile motif={cell.motif} fg={cell.fg} rot={cell.rot} />
          {bordered && (
            <rect
              x="0"
              y="0"
              width="100"
              height="100"
              fill="none"
              stroke="#1C1C1C"
              strokeOpacity="0.12"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          )}
        </svg>
      ))}
    </div>
  )
}
