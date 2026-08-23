import { createContext, useContext, useId, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { type BauhausColor } from '@/lib/types'
import { useFormFieldSemantics } from './FormFieldContext'

interface RadioGroupContextValue {
  name: string
  value: string | undefined
  onChange: (v: string) => void
  required: boolean
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null)

export interface RadioGroupProps {
  id?: string
  value?: string
  defaultValue?: string
  onValueChange?: (v: string) => void
  name?: string
  orientation?: 'horizontal' | 'vertical'
  className?: string
  children: ReactNode
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
  'aria-required'?: boolean | 'true' | 'false'
  'aria-invalid'?: boolean | 'true' | 'false'
}

/**
 * Groups Radio controls, sharing name/value/onChange via context. Supports
 * controlled (`value`) and uncontrolled (`defaultValue`) usage.
 */
export function RadioGroup({
  id,
  value,
  defaultValue,
  onValueChange,
  name,
  orientation = 'vertical',
  className,
  children,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  'aria-describedby': ariaDescribedBy,
  'aria-required': ariaRequired,
  'aria-invalid': ariaInvalid,
}: RadioGroupProps) {
  const autoName = useId()
  const [internal, setInternal] = useState<string | undefined>(defaultValue)
  const isControlled = value !== undefined
  const current = isControlled ? value : internal
  const semantics = useFormFieldSemantics(ariaDescribedBy)

  const onChange = (v: string) => {
    if (!isControlled) setInternal(v)
    onValueChange?.(v)
  }

  const computedLabelledBy = ariaLabelledby ?? (ariaLabel ? undefined : semantics.labelId)

  return (
    <RadioGroupContext.Provider
      value={{ name: name ?? autoName, value: current, onChange, required: Boolean(semantics.required) }}
    >
      <div
        id={id ?? semantics.controlId}
        role="radiogroup"
        aria-label={ariaLabel}
        aria-labelledby={computedLabelledBy}
        aria-describedby={semantics.describedBy}
        aria-required={ariaRequired ?? (semantics.required || undefined)}
        aria-invalid={ariaInvalid ?? (semantics.invalid || undefined)}
        className={cn(
          'bui-reset',
          'bui-flex bui-gap-x-6 bui-gap-y-3',
          orientation === 'vertical' ? 'bui-flex-col' : 'bui-flex-row bui-flex-wrap bui-items-center',
          className,
        )}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  )
}

/** Fill color of the inner dot, per palette color. */
const dotColor: Record<BauhausColor, string> = {
  red: 'bui-bg-bred',
  blue: 'bui-bg-bblue',
  yellow: 'bui-bg-byellow',
  ink: 'bui-bg-ink',
}

export interface RadioProps {
  value: string
  label?: string
  color?: BauhausColor
  disabled?: boolean
  className?: string
}

/**
 * A single circular radio option. Must be rendered inside a RadioGroup. Uses a
 * native radio input under the hood for full keyboard accessibility.
 */
export function Radio({ value, label, color = 'ink', disabled, className }: RadioProps) {
  const ctx = useContext(RadioGroupContext)
  if (!ctx) throw new Error('Radio must be used within a RadioGroup')
  const checked = ctx.value === value

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
          type="radio"
          name={ctx.name}
          value={value}
          checked={checked}
          disabled={disabled}
          required={ctx.required}
          onChange={() => ctx.onChange(value)}
          className="bui-reset peer bui-absolute bui-inset-0 bui-h-full bui-w-full bui-cursor-pointer bui-opacity-0 disabled:bui-cursor-not-allowed"
        />
        <span
          aria-hidden
          className={cn(
            'bui-reset',
            'bui-pointer-events-none bui-flex bui-h-6 bui-w-6 bui-items-center bui-justify-center bui-rounded-full bui-border-3 bui-border-ink bui-bg-surface',
            'peer-focus-visible:bui-outline peer-focus-visible:outline-3 peer-focus-visible:bui-outline-offset-2 peer-focus-visible:bui-outline-bblue',
          )}
        >
          <span
            className={cn(
              'bui-reset',
              'bui-h-2.5 bui-w-2.5 bui-rounded-full bui-transition-transform',
              checked ? 'bui-scale-100' : 'bui-scale-0',
              dotColor[color],
            )}
          />
        </span>
      </span>
      {label && <span className="bui-reset bui-font-sans bui-text-base bui-text-ink">{label}</span>}
    </label>
  )
}
