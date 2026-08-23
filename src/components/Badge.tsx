import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { solidColor, textColor, type BauhausColor, type Size } from '@/lib/types'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'solid' | 'outline'
  color?: BauhausColor
  size?: Size
}

const sizes: Record<Size, string> = {
  sm: 'bui-h-5 bui-px-1.5 bui-text-[10px] bui-gap-1',
  md: 'bui-h-6 bui-px-2 bui-text-xs bui-gap-1.5',
  lg: 'bui-h-7 bui-px-2.5 bui-text-sm bui-gap-1.5',
}

/**
 * Small bordered label for statuses, counts and categories.
 * Uppercase display type, sharp corners, thick ink border.
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { variant = 'solid', color = 'ink', size = 'md', className, children, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn(
        'bui-reset',
        'bui-inline-flex bui-items-center bui-justify-center bui-border-3 bui-border-ink bui-font-display bui-font-bold bui-uppercase bui-tracking-wide bui-leading-none',
        sizes[size],
        variant === 'solid' && solidColor[color],
        variant === 'outline' && cn('bui-bg-transparent', textColor[color]),
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
})
