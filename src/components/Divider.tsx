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
  const lineColor = color === 'ink' ? 'rgb(var(--bui-ink))' : hex[color]

  if (orientation === 'vertical') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn('bui-reset', 'bui-inline-block bui-self-stretch', className)}
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
        className={cn('bui-reset', 'bui-flex bui-items-center bui-gap-3', className)}
        style={style}
        {...props}
      >
        <span
          className="bui-reset bui-flex-1"
          style={{ borderTopWidth: thickness, borderTopStyle: variant, borderTopColor: lineColor }}
        />
        <span className="bui-reset bui-shrink-0 bui-font-display bui-text-sm bui-font-bold bui-uppercase bui-tracking-wide bui-text-ink">
          {label}
        </span>
        <span
          className="bui-reset bui-flex-1"
          style={{ borderTopWidth: thickness, borderTopStyle: variant, borderTopColor: lineColor }}
        />
      </div>
    )
  }

  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className={cn('bui-reset', 'bui-w-full', className)}
      style={{ borderTopWidth: thickness, borderTopStyle: variant, borderTopColor: lineColor, ...style }}
      {...props}
    />
  )
}
