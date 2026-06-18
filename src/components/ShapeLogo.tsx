import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { Shape, type ShapeKind } from './Shape'
import { type BauhausColor } from '@/lib/types'

export interface ShapeLogoProps extends HTMLAttributes<HTMLDivElement> {
  /** The shapes that make up the mark, left to right. */
  shapes?: { kind: ShapeKind; color: BauhausColor }[]
  /** Optional wordmark shown next to the shapes. */
  label?: string
  size?: number
}

const DEFAULT_MARK: { kind: ShapeKind; color: BauhausColor }[] = [
  { kind: 'square', color: 'ink' },
  { kind: 'circle', color: 'red' },
  { kind: 'triangle', color: 'blue' },
  { kind: 'cross', color: 'yellow' },
]

// Optical kerning: shapes whose mass recedes from a vertical edge (a triangle's
// sloped sides) read as over-spaced. Nudge them toward the previous shape so the
// gaps look even even though the raw box gaps are equal.
const KERN: Partial<Record<ShapeKind, string>> = {
  triangle: '-ml-1',
}

/** A Bauhaus-style logo mark built from primitive shapes, with an optional wordmark. */
export function ShapeLogo({ shapes = DEFAULT_MARK, label, size = 22, className, ...props }: ShapeLogoProps) {
  return (
    <div className={cn('inline-flex items-center gap-2', className)} {...props}>
      <span className="inline-flex items-center gap-1">
        {shapes.map((s, i) => (
          <Shape
            key={i}
            kind={s.kind}
            color={s.color}
            size={size}
            className={i > 0 ? KERN[s.kind] : undefined}
          />
        ))}
      </span>
      {label && (
        <span className="whitespace-nowrap font-display text-lg font-bold uppercase tracking-tight text-ink">
          {label}
        </span>
      )}
    </div>
  )
}
