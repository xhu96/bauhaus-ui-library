import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { type Size } from '@/lib/types'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  inputSize?: Size
  error?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

const sizes: Record<Size, string> = {
  sm: 'h-9 text-sm',
  md: 'h-11 text-base',
  lg: 'h-14 text-lg',
}

const padX: Record<Size, { base: string; left: string; right: string }> = {
  sm: { base: 'px-3', left: 'pl-9', right: 'pr-9' },
  md: { base: 'px-4', left: 'pl-11', right: 'pr-11' },
  lg: { base: 'px-5', left: 'pl-14', right: 'pr-14' },
}

const iconBox: Record<Size, string> = {
  sm: 'w-9',
  md: 'w-11',
  lg: 'w-14',
}

/**
 * Thick-bordered text input with optional left/right icon adornments and an
 * error state. Bauhaus styling: 3px ink border, sharp corners.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { inputSize = 'md', error = false, leftIcon, rightIcon, className, disabled, ...props },
  ref,
) {
  return (
    <div className="relative inline-flex w-full items-center">
      {leftIcon && (
        <span
          className={cn(
            'pointer-events-none absolute left-0 inline-flex items-center justify-center text-ink-muted',
            iconBox[inputSize],
            'h-full',
          )}
          aria-hidden
        >
          {leftIcon}
        </span>
      )}
      <input
        ref={ref}
        disabled={disabled}
        aria-invalid={error || undefined}
        className={cn(
          'w-full border-3 bg-surface font-sans text-ink placeholder:text-ink-muted',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error ? 'border-bred' : 'border-ink',
          sizes[inputSize],
          padX[inputSize].base,
          leftIcon && padX[inputSize].left,
          rightIcon && padX[inputSize].right,
          className,
        )}
        {...props}
      />
      {rightIcon && (
        <span
          className={cn(
            'pointer-events-none absolute right-0 inline-flex items-center justify-center text-ink-muted',
            iconBox[inputSize],
            'h-full',
          )}
          aria-hidden
        >
          {rightIcon}
        </span>
      )}
    </div>
  )
})
