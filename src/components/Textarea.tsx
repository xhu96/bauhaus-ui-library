import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { useFormFieldSemantics } from './FormFieldContext'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

/**
 * Thick-bordered multiline text input. Bauhaus styling: 3px ink border,
 * sharp corners, vertical resize.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    error = false,
    className,
    disabled,
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid,
    'aria-required': ariaRequired,
    ...props
  },
  ref,
) {
  const semantics = useFormFieldSemantics(ariaDescribedBy)

  return (
    <textarea
      ref={ref}
      disabled={disabled}
      aria-describedby={semantics.describedBy}
      aria-required={ariaRequired ?? (semantics.required || undefined)}
      aria-invalid={ariaInvalid ?? (error || semantics.invalid || undefined)}
      className={cn(
        'min-h-[6rem] w-full resize-y border-3 bg-surface px-4 py-3 font-sans text-base text-ink placeholder:text-ink-muted',
        'disabled:cursor-not-allowed disabled:opacity-50',
        error ? 'border-bred' : 'border-ink',
        className,
      )}
      {...props}
    />
  )
})
