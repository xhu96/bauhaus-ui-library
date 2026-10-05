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

  return (
    <textarea
      ref={ref}
      data-bui-control="textarea"
      id={id ?? semantics.controlId}
      disabled={disabled}
      required={required ?? (semantics.required || undefined)}
      aria-describedby={semantics.describedBy}
      aria-labelledby={props['aria-labelledby'] ?? (props['aria-label'] ? undefined : semantics.labelId)}
      aria-required={ariaRequired ?? required ?? (semantics.required || undefined)}
      aria-invalid={ariaInvalid ?? (error || semantics.invalid || undefined)}
      className={cn(
        'bui-reset',
        'bui-min-h-[6rem] bui-w-full bui-resize-y bui-border-3 bui-bg-surface bui-px-4 bui-py-3 bui-font-sans bui-text-base bui-text-ink placeholder:bui-text-ink-muted',
        'disabled:bui-cursor-not-allowed disabled:bui-opacity-50',
        error || semantics.invalid ? 'bui-border-bred' : 'bui-border-ink',
        className,
      )}
      {...props}
    />
  )
})
