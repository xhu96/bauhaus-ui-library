import { forwardRef, type SelectHTMLAttributes, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type Size } from '@/lib/types'
import { useFormFieldSemantics } from './FormFieldContext'

export interface SelectOption {
  label: string
  value: string
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  selectSize?: Size
  error?: boolean
  options?: SelectOption[]
  children?: ReactNode
}

const sizes: Record<Size, string> = {
  sm: 'bui-h-9 bui-text-sm bui-pl-3 bui-pr-9',
  md: 'bui-h-11 bui-text-base bui-pl-4 bui-pr-11',
  lg: 'bui-h-14 bui-text-lg bui-pl-5 bui-pr-14',
}

const chevronPos: Record<Size, string> = {
  sm: 'bui-right-2.5',
  md: 'bui-right-3.5',
  lg: 'bui-right-4',
}

/**
 * Thick-bordered native select with a custom Bauhaus chevron. Pass `options`
 * or `children` to populate the list.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    selectSize = 'md',
    error = false,
    options,
    className,
    disabled,
    id,
    required,
    children,
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid,
    'aria-required': ariaRequired,
    ...props
  },
  ref,
) {
  const semantics = useFormFieldSemantics(ariaDescribedBy)

  return (
    <div className="bui-reset bui-relative bui-inline-flex bui-w-full bui-items-center">
      <select
        ref={ref}
        data-bui-control="select"
        data-bui-size={selectSize}
        id={id ?? semantics.controlId}
        disabled={disabled}
        required={required ?? (semantics.required || undefined)}
        aria-describedby={semantics.describedBy}
        aria-labelledby={props['aria-labelledby'] ?? (props['aria-label'] ? undefined : semantics.labelId)}
        aria-required={ariaRequired ?? required ?? (semantics.required || undefined)}
        aria-invalid={ariaInvalid ?? (error || semantics.invalid || undefined)}
        className={cn(
          'bui-reset',
          'bui-w-full bui-appearance-none bui-border-3 bui-bg-surface bui-font-sans bui-text-ink',
          'disabled:bui-cursor-not-allowed disabled:bui-opacity-50',
          error || semantics.invalid ? 'bui-border-bred' : 'bui-border-ink',
          sizes[selectSize],
          className,
        )}
        {...props}
      >
        {options
          ? options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))
          : children}
      </select>
      <ChevronDown
        className={cn(
          'bui-reset',
          'bui-pointer-events-none bui-absolute bui-h-5 bui-w-5 bui-text-ink',
          chevronPos[selectSize],
        )}
        aria-hidden
      />
    </div>
  )
})
