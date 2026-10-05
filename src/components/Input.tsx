import { forwardRef, type HTMLInputTypeAttribute, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { type Size } from '@/lib/types'
import { useFormFieldSemantics } from './FormFieldContext'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  inputSize?: Size
  error?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

const sizes: Record<Size, string> = {
  sm: 'bui-h-9 bui-text-sm',
  md: 'bui-h-11 bui-text-base',
  lg: 'bui-h-14 bui-text-lg',
}

const padX: Record<Size, { base: string; left: string; right: string }> = {
  sm: { base: 'bui-px-3', left: 'bui-pl-9', right: 'bui-pr-9' },
  md: { base: 'bui-px-4', left: 'bui-pl-11', right: 'bui-pr-11' },
  lg: { base: 'bui-px-5', left: 'bui-pl-14', right: 'bui-pr-14' },
}

const iconBox: Record<Size, string> = {
  sm: 'bui-w-9',
  md: 'bui-w-11',
  lg: 'bui-w-14',
}

const inputTypesWithoutRequired = new Set<HTMLInputTypeAttribute>([
  'button',
  'color',
  'hidden',
  'image',
  'range',
  'reset',
  'submit',
])

/**
 * Thick-bordered text input with optional left/right icon adornments and an
 * error state. Bauhaus styling: 3px ink border, sharp corners.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    inputSize = 'md',
    error = false,
    leftIcon,
    rightIcon,
    className,
    disabled,
    id,
    required,
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid,
    'aria-required': ariaRequired,
    ...props
  },
  ref,
) {
  const semantics = useFormFieldSemantics(ariaDescribedBy)
  const derivesRequired = !inputTypesWithoutRequired.has(props.type ?? 'text')

  return (
    <div className="bui-reset bui-relative bui-inline-flex bui-w-full bui-items-center">
      {leftIcon && (
        <span
          className={cn(
            'bui-reset',
            'bui-pointer-events-none bui-absolute bui-left-0 bui-inline-flex bui-items-center bui-justify-center bui-text-ink-muted',
            iconBox[inputSize],
            'bui-h-full',
          )}
          aria-hidden
        >
          {leftIcon}
        </span>
      )}
      <input
        ref={ref}
        data-bui-control="input"
        data-bui-size={inputSize}
        id={id ?? semantics.controlId}
        disabled={disabled}
        required={required ?? (semantics.required && derivesRequired ? true : undefined)}
        aria-describedby={semantics.describedBy}
        aria-labelledby={props['aria-labelledby'] ?? (props['aria-label'] ? undefined : semantics.labelId)}
        aria-required={ariaRequired ?? required ?? (semantics.required && derivesRequired ? true : undefined)}
        aria-invalid={ariaInvalid ?? (error || semantics.invalid || undefined)}
        className={cn(
          'bui-reset',
          'bui-w-full bui-border-3 bui-bg-surface bui-font-sans bui-text-ink placeholder:bui-text-ink-muted',
          'disabled:bui-cursor-not-allowed disabled:bui-opacity-50',
          error || semantics.invalid ? 'bui-border-bred' : 'bui-border-ink',
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
            'bui-reset',
            'bui-pointer-events-none bui-absolute bui-right-0 bui-inline-flex bui-items-center bui-justify-center bui-text-ink-muted',
            iconBox[inputSize],
            'bui-h-full',
          )}
          aria-hidden
        >
          {rightIcon}
        </span>
      )}
    </div>
  )
})
