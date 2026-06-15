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
      return <circle cx="50" cy="50" r="46" fill={fg} />
    case 'dot':
      return <circle cx="50" cy="50" r="18" fill={fg} />
    case 'ring':
      return <circle cx="50" cy="50" r="38" fill="none" stroke={fg} strokeWidth="14" />
    case 'half':
      return g(<path d="M4 96 A46 46 0 0 1 96 96 Z" fill={fg} />)
    case 'quarter':
      return g(<path d="M4 4 A92 92 0 0 1 96 96 L4 96 Z" fill={fg} />)
    case 'triangle':
      return g(<polygon points="4,96 96,96 4,4" fill={fg} />)
    case 'diagonal':
      return g(<polygon points="0,0 100,0 0,100" fill={fg} />)
    case 'plus':
      return (
        <g fill={fg}>
          <rect x="42" y="8" width="16" height="84" />
          <rect x="8" y="42" width="84" height="16" />
        </g>
      )
    case 'leaf':
      return (
        <g fill={fg}>
          <path d="M0 0 A100 100 0 0 0 100 100 L0 100 Z" />
          <path d="M100 100 A100 100 0 0 0 0 0 L100 0 Z" />
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
