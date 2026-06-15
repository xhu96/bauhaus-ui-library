import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
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
  sm: 'h-9 px-3 text-sm gap-1.5',
  md: 'h-11 px-5 text-base gap-2',
  lg: 'h-14 px-7 text-lg gap-2.5',
}

const outlineColor: Record<BauhausColor, string> = {
  red: 'text-bred hover:bg-bred hover:text-white',
  blue: 'text-bblue hover:bg-bblue hover:text-white',
  yellow: 'text-byellow-dark hover:bg-byellow hover:text-coal',
  ink: 'text-ink hover:bg-ink hover:text-paper',
}

const ghostColor: Record<BauhausColor, string> = {
  red: 'text-bred hover:bg-bred/10',
  blue: 'text-bblue hover:bg-bblue/10',
  yellow: 'text-byellow-dark hover:bg-byellow/20',
  ink: 'text-ink hover:bg-ink/10',
}

/**
 * Primary action button. Bauhaus styling: 2px ink border, sharp corners,
 * a hard offset shadow that depresses on click.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
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
      disabled={disabled || isLoading}
      className={cn(
        'press inline-flex items-center justify-center border-3 border-ink font-display font-semibold uppercase tracking-wide',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none',
        sizes[size],
        variant === 'solid' && cn(solidColor[color], solidHover[color], 'press-hard'),
        variant === 'outline' && cn('bg-transparent press-hard', outlineColor[color]),
        variant === 'ghost' && cn('border-transparent bg-transparent', ghostColor[color]),
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-[1.1em] w-[1.1em] animate-spin" aria-hidden />
      ) : (
        leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
      )}
      {children}
      {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </button>
  )
})
