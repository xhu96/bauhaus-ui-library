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
  const controlId = htmlFor ?? `${supportId}-control`
  const labelId = label ? `${controlId}-label` : undefined
  const errorId = error ? `${supportId}-error` : undefined
  const hintId = hint ? `${supportId}-hint` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <FormFieldContext.Provider value={{ controlId, describedBy, labelId, invalid: Boolean(error), required }}>
      <div className={cn('bui-reset', 'bui-flex bui-flex-col bui-gap-1.5', className)}>
        {label && (
          <label
            id={labelId}
            htmlFor={controlId}
            className="bui-reset bui-font-display bui-text-sm bui-font-semibold bui-uppercase bui-tracking-wide bui-text-ink"
          >
            {label}
            {required && (
              <span className="bui-reset bui-ml-1 bui-text-bred-ink" aria-hidden>
                *
              </span>
            )}
          </label>
        )}
        {children}
        {hint && (
          <p id={hintId} className="bui-reset bui-m-0 bui-text-sm bui-text-ink-muted">
            {hint}
          </p>
        )}
        {error && (
          <p id={errorId} className="bui-reset bui-m-0 bui-text-sm bui-font-medium bui-text-bred-ink">
            {error}
          </p>
        )}
      </div>
    </FormFieldContext.Provider>
  )
}
