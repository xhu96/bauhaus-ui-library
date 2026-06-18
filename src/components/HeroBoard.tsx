import { type CSSProperties, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import './HeroBoard.css'

type ColorKey = 'red' | 'blue' | 'yellow' | 'ink' | 'paper' | 'white'

const C: Record<ColorKey, string> = {
  red: '#E63329',
  blue: '#21409A',
  yellow: '#F4C20D',
  ink: '#1C1C1C',
  paper: '#F3EFE6',
  white: '#FFFFFF',
}

interface TileDef {
  cls: string
  bg: ColorKey
  fg: ColorKey
  fg2?: ColorKey
}

// Fixed, hand-composed 5x4 board (row by row), balanced across the four colours.
const TILES: TileDef[] = [
  // Row 1
  { cls: 'ring', bg: 'blue', fg: 'yellow' },
  { cls: 'cross', bg: 'white', fg: 'blue' },
  { cls: 'diag-c', bg: 'paper', fg: 'blue', fg2: 'red' },
  { cls: 'quarter q-br', bg: 'white', fg: 'yellow' },
  { cls: 'circle', bg: 'red', fg: 'paper' },
  // Row 2
  { cls: 'cross slim', bg: 'ink', fg: 'white' },
  { cls: 'diag-b', bg: 'paper', fg: 'yellow' },
  { cls: 'quarter q-tr', bg: 'red', fg: 'blue' },
  { cls: 'bullseye', bg: 'paper', fg: 'red', fg2: 'blue' },
  { cls: 'plus-fat', bg: 'yellow', fg: 'ink' },
  // Row 3
  { cls: 'diag-a', bg: 'white', fg: 'blue' },
  { cls: 'quarter q-bl bar-v', bg: 'paper', fg: 'red', fg2: 'ink' },
  { cls: 'circle', bg: 'paper', fg: 'blue' },
  { cls: 'cross slim', bg: 'blue', fg: 'white' },
  { cls: 'diag-b', bg: 'yellow', fg: 'ink' },
  // Row 4
  { cls: 'quarter q-bl', bg: 'paper', fg: 'red' },
  { cls: 'ring', bg: 'yellow', fg: 'blue' },
  { cls: 'plus-fat', bg: 'red', fg: 'paper' },
  { cls: 'diag-a', bg: 'paper', fg: 'blue' },
  { cls: 'arc q-tr bar-h', bg: 'white', fg: 'red', fg2: 'yellow' },
]

function tileStyle(t: TileDef): CSSProperties {
  const s: Record<string, string> = { '--bg': C[t.bg], '--fg': C[t.fg] }
  if (t.fg2) s['--fg2'] = C[t.fg2]
  return s as CSSProperties
}

/**
 * The signature hero board: a fixed, hand-composed 5x4 Neo-Bauhaus grid.
 * Decorative (aria-hidden); wrap it in the project's bordered/hard-shadow frame.
 */
export function HeroBoard({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('hb', className)} {...props}>
      <div className="board" aria-hidden="true">
        {TILES.map((t, i) => (
          <div key={i} className={`tile ${t.cls}`} style={tileStyle(t)} />
        ))}
      </div>
    </div>
  )
}
