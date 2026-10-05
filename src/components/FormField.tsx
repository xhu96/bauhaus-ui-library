import {
  Children,
  cloneElement,
  isValidElement,
  type InputHTMLAttributes,
  type ReactNode,
  useId,
} from 'react'
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
 * Labels one control (or one RadioGroup). Use a single immediate child for
 * automatic ID ownership; direct native input/select/textarea children also
 * receive missing semantics. For arbitrary nested/native composition, supply
 * htmlFor matching the control's ID. Multiple controls need separate fields
 * or an explicitly labelled group; arbitrary child trees are never cloned.
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
  const childArray = Children.toArray(children)
  const singleChild =
    childArray.length === 1 && isValidElement<InputHTMLAttributes<HTMLInputElement>>(childArray[0])
      ? childArray[0]
      : null
  const controlId = htmlFor ?? singleChild?.props.id ?? `${supportId}-control`
  const labelId = label ? `${controlId}-label` : undefined
  const errorId = error ? `${supportId}-error` : undefined
  const hintId = hint ? `${supportId}-hint` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined
  const nativeChild =
    singleChild &&
    typeof singleChild.type === 'string' &&
    ['input', 'select', 'textarea'].includes(singleChild.type)
  const childProps = singleChild?.props
  const supportsRequired =
    singleChild?.type !== 'input' ||
    !['button', 'color', 'hidden', 'image', 'range', 'reset', 'submit'].includes(childProps?.type ?? 'text')
  const nativeRequired = childProps?.required ?? (required && supportsRequired ? true : undefined)
  const content = nativeChild
    ? cloneElement(singleChild, {
        id: childProps?.id ?? controlId,
        required: nativeRequired,
        'aria-labelledby':
          childProps?.['aria-labelledby'] ?? (childProps?.['aria-label'] ? undefined : labelId),
        'aria-describedby':
          [childProps?.['aria-describedby'], describedBy].filter(Boolean).join(' ') || undefined,
        'aria-required': childProps?.['aria-required'] ?? nativeRequired,
        'aria-invalid': childProps?.['aria-invalid'] ?? (Boolean(error) || undefined),
      })
    : children

  return (
    <FormFieldContext.Provider
      value={singleChild ? { controlId, describedBy, labelId, invalid: Boolean(error), required } : null}
    >
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
        {content}
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
