import { forwardRef, type InputHTMLAttributes } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type BauhausColor } from '@/lib/types'
import { useFormFieldSemantics } from './FormFieldContext'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  color?: BauhausColor
}

/** Background applied to the custom box when checked, per palette color. */
const checkedFill: Record<BauhausColor, string> = {
  red: 'peer-checked:bui-bg-bred',
  blue: 'peer-checked:bui-bg-bblue',
  yellow: 'peer-checked:bui-bg-byellow',
  ink: 'peer-checked:bui-bg-ink',
}

/** Check-icon color so it stays legible on the fill. */
const checkColor: Record<BauhausColor, string> = {
  red: 'bui-text-white',
  blue: 'bui-text-white',
  yellow: 'bui-text-coal',
  ink: 'bui-text-paper',
}

/**
 * Custom checkbox: a visually-hidden native input drives a 3px-bordered square
 * that fills with the chosen color and reveals a Check icon when selected.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    label,
    color = 'ink',
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
    <label
      className={cn(
        'bui-reset',
        'bui-inline-flex bui-cursor-pointer bui-select-none bui-items-center bui-gap-2.5',
        disabled && 'bui-cursor-not-allowed bui-opacity-50',
        className,
      )}
    >
      <span className="bui-reset bui-relative bui-inline-flex bui-h-6 bui-w-6 bui-shrink-0">
        <input
          ref={ref}
          id={id ?? semantics.controlId}
          type="checkbox"
          disabled={disabled}
          required={required ?? (semantics.required || undefined)}
          aria-describedby={semantics.describedBy}
          aria-required={ariaRequired ?? (semantics.required || undefined)}
          aria-invalid={ariaInvalid ?? (semantics.invalid || undefined)}
          className="bui-reset peer bui-absolute bui-inset-0 bui-h-full bui-w-full bui-cursor-pointer bui-opacity-0 disabled:bui-cursor-not-allowed"
          {...props}
        />
        <span
          aria-hidden
          className={cn(
            'bui-reset',
            'bui-pointer-events-none bui-flex bui-h-6 bui-w-6 bui-items-center bui-justify-center bui-border-3 bui-bg-surface',
            semantics.invalid ? 'bui-border-bred' : 'bui-border-ink',
            'peer-focus-visible:bui-outline peer-focus-visible:outline-3 peer-focus-visible:bui-outline-offset-2 peer-focus-visible:bui-outline-bblue',
            'peer-checked:[&>svg]:bui-opacity-100',
            checkedFill[color],
          )}
        >
          <Check
            className={cn(
              'bui-reset',
              'bui-h-4 bui-w-4 bui-opacity-0 bui-[stroke-width:3]',
              checkColor[color],
            )}
          />
        </span>
      </span>
      {label && <span className="bui-reset bui-font-sans bui-text-base bui-text-ink">{label}</span>}
    </label>
  )
})
