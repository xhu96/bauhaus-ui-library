import { type ReactNode, useId } from 'react'
import { cn } from '@/lib/utils'
import { FormFieldContext } from './FormFieldContext'

export interface FormFieldProps {
  label?: string
  hint?: string
  error?: string
  required?: boolean
  htmlFor?: string
  className?: string
  children: ReactNode
}

/**
 * Pairs a label, hint, and error message with any form control. Keep the
 * control itself label-free and let FormField handle the labeling pattern.
 */
export function FormField({
  label,
  hint,
  error,
  required = false,
  htmlFor,
  className,
  children,
}: FormFieldProps) {
  const supportId = useId()
  const errorId = error ? `${supportId}-error` : undefined
  const hintId = hint && !error ? `${supportId}-hint` : undefined
  const describedBy = errorId ?? hintId

  return (
    <FormFieldContext.Provider value={{ describedBy, invalid: Boolean(error), required }}>
      <div className={cn('flex flex-col gap-1.5', className)}>
        {label && (
          <label
            htmlFor={htmlFor}
            className="font-display text-sm font-semibold uppercase tracking-wide text-ink"
          >
            {label}
            {required && (
              <span className="ml-1 text-bred-ink" aria-hidden>
                *
              </span>
            )}
          </label>
        )}
        {children}
        {error ? (
          <p id={errorId} className="text-sm font-medium text-bred-ink">
            {error}
          </p>
        ) : hint ? (
          <p id={hintId} className="text-sm text-ink-muted">
            {hint}
          </p>
        ) : null}
      </div>
    </FormFieldContext.Provider>
  )
}
