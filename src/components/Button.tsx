import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Spinner } from './Spinner'
import { type BauhausColor, type Size } from '@/lib/types'
import { actionStyles } from '@/lib/actionStyles'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline' | 'ghost'
  color?: BauhausColor
  /**
   * Optional semantic hierarchy: primary is solid blue, secondary is a quiet
   * ink outline, destructive is solid accessible red. When supplied, intent
   * takes precedence over color and variant. Omit it to retain legacy styling.
   */
  intent?: 'primary' | 'secondary' | 'destructive'
  size?: Size
  fullWidth?: boolean
  isLoading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

const spinnerSizes: Record<Size, number> = {
  sm: 16,
  md: 18,
  lg: 20,
}

/**
 * Primary action button. Bauhaus styling: 3px ink border, sharp corners,
 * a hard offset shadow that depresses on click.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    type = 'button',
    variant = 'solid',
    color = 'ink',
    intent,
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
      data-bui-control="button"
      data-bui-size={size}
      className={cn(actionStyles({ variant, color, size, intent }), fullWidth && 'bui-w-full', className)}
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
