import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { solidColor, textColor, type BauhausColor, type Size } from '@/lib/types'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'solid' | 'outline'
  color?: BauhausColor
  size?: Size
}

const sizes: Record<Size, string> = {
  sm: 'h-5 px-1.5 text-[10px] gap-1',
  md: 'h-6 px-2 text-xs gap-1.5',
  lg: 'h-7 px-2.5 text-sm gap-1.5',
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
        'inline-flex items-center justify-center border-3 border-ink font-display font-bold uppercase tracking-wide leading-none',
        sizes[size],
        variant === 'solid' && solidColor[color],
        variant === 'outline' && cn('bg-transparent', textColor[color]),
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
})
