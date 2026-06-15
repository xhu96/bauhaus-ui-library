import { type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { hex, type BauhausColor } from '@/lib/types'

export interface DividerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
  orientation?: 'horizontal' | 'vertical'
  variant?: 'solid' | 'dashed' | 'dotted'
  color?: BauhausColor
  /** Line thickness in pixels. */
  thickness?: number
  /** Centered label that breaks a horizontal line. */
  label?: ReactNode
}

/**
 * A geometric separator drawn with borders. Supports solid/dashed/dotted
 * lines, either orientation, and a centered label (horizontal only).
 */
export function Divider({
  orientation = 'horizontal',
  variant = 'solid',
  color = 'ink',
  thickness = 3,
  label,
  className,
  style,
  ...props
}: DividerProps) {
  const lineColor = hex[color]

  if (orientation === 'vertical') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn('inline-block self-stretch', className)}
        style={{ borderLeftWidth: thickness, borderLeftStyle: variant, borderLeftColor: lineColor, ...style }}
        {...props}
      />
    )
  }

  if (label != null) {
    return (
      <div
        role="separator"
        aria-orientation="horizontal"
        className={cn('flex items-center gap-3', className)}
        style={style}
        {...props}
      >
        <span
          className="flex-1"
          style={{ borderTopWidth: thickness, borderTopStyle: variant, borderTopColor: lineColor }}
        />
        <span className="shrink-0 font-display text-sm font-bold uppercase tracking-wide text-ink">{label}</span>
        <span
          className="flex-1"
          style={{ borderTopWidth: thickness, borderTopStyle: variant, borderTopColor: lineColor }}
        />
      </div>
    )
  }

  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className={cn('w-full', className)}
      style={{ borderTopWidth: thickness, borderTopStyle: variant, borderTopColor: lineColor, ...style }}
      {...props}
    />
  )
}
