import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Spinner } from './Spinner'
import { solidColor, solidHover, type BauhausColor, type Size } from '@/lib/types'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline' | 'ghost'
  color?: BauhausColor
  size?: Size
  fullWidth?: boolean
  isLoading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

const sizes: Record<Size, string> = {
  sm: 'bui-h-9 bui-px-3 bui-text-sm bui-gap-1.5',
  md: 'bui-h-11 bui-px-5 bui-text-base bui-gap-2',
  lg: 'bui-h-14 bui-px-7 bui-text-lg bui-gap-2.5',
}

const spinnerSizes: Record<Size, number> = {
  sm: 16,
  md: 18,
  lg: 20,
}

const outlineColor: Record<BauhausColor, string> = {
  red: 'bui-text-bred-ink hover:bui-bg-bred-dark hover:bui-text-white',
  blue: 'bui-text-bblue hover:bui-bg-bblue hover:bui-text-white',
  yellow: 'bui-text-byellow-ink hover:bui-bg-byellow hover:bui-text-coal',
  ink: 'bui-text-ink hover:bui-bg-ink hover:bui-text-paper',
}

const ghostColor: Record<BauhausColor, string> = {
  red: 'bui-text-bred-ink hover:bui-bg-bred/10',
  blue: 'bui-text-bblue hover:bui-bg-bblue/10',
  yellow: 'bui-text-byellow-ink hover:bui-bg-byellow/20',
  ink: 'bui-text-ink hover:bui-bg-ink/10',
}

/**
 * Primary action button. Bauhaus styling: 2px ink border, sharp corners,
 * a hard offset shadow that depresses on click.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    type = 'button',
    variant = 'solid',
    color = 'ink',
    size = 'md',
    fullWidth = false,
    isLoading = false,
    leftIcon,
    rightIcon,
    className,
    children,
    disabled,
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      className={cn(
        'bui-reset',
        'bui-press bui-inline-flex bui-items-center bui-justify-center bui-border-3 bui-border-ink bui-font-display bui-font-semibold bui-uppercase bui-tracking-wide',
        'disabled:bui-cursor-not-allowed disabled:bui-opacity-50 disabled:bui-shadow-none',
        sizes[size],
        variant === 'solid' && cn(solidColor[color], solidHover[color], 'bui-press-hard'),
        variant === 'outline' && cn('bui-bg-transparent bui-press-hard', outlineColor[color]),
        variant === 'ghost' && cn('bui-border-transparent bui-bg-transparent', ghostColor[color]),
        fullWidth && 'bui-w-full',
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <Spinner decorative size={spinnerSizes[size]} className="bui-text-current" />
      ) : (
        leftIcon && <span className="bui-reset bui-inline-flex bui-shrink-0">{leftIcon}</span>
      )}
      {children}
      {!isLoading && rightIcon && <span className="bui-reset bui-inline-flex bui-shrink-0">{rightIcon}</span>}
    </button>
  )
})
