import {
  createContext,
  useContext,
  useId,
  useState,
  type ReactNode,
} from 'react'
import { cn } from '@/lib/utils'
import { type BauhausColor } from '@/lib/types'

interface RadioGroupContextValue {
  name: string
  value: string | undefined
  onChange: (v: string) => void
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null)

export interface RadioGroupProps {
  value?: string
  defaultValue?: string
  onValueChange?: (v: string) => void
  name?: string
  orientation?: 'horizontal' | 'vertical'
  className?: string
  children: ReactNode
}

/**
 * Groups Radio controls, sharing name/value/onChange via context. Supports
 * controlled (`value`) and uncontrolled (`defaultValue`) usage.
 */
export function RadioGroup({
  value,
  defaultValue,
  onValueChange,
  name,
  orientation = 'vertical',
  className,
  children,
}: RadioGroupProps) {
  const autoName = useId()
  const [internal, setInternal] = useState<string | undefined>(defaultValue)
  const isControlled = value !== undefined
  const current = isControlled ? value : internal

  const onChange = (v: string) => {
    if (!isControlled) setInternal(v)
    onValueChange?.(v)
  }

  return (
    <RadioGroupContext.Provider value={{ name: name ?? autoName, value: current, onChange }}>
      <div
        role="radiogroup"
        className={cn(
          'flex gap-x-6 gap-y-3',
          orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap items-center',
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
  red: 'bg-bred',
  blue: 'bg-bblue',
  yellow: 'bg-byellow',
  ink: 'bg-ink',
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
        'inline-flex cursor-pointer select-none items-center gap-2.5',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      <span className="relative inline-flex h-6 w-6 shrink-0">
        <input
          type="radio"
          name={ctx.name}
          value={value}
          checked={checked}
          disabled={disabled}
          onChange={() => ctx.onChange(value)}
          className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
        />
        <span
          aria-hidden
          className={cn(
            'pointer-events-none flex h-6 w-6 items-center justify-center rounded-full border-3 border-ink bg-surface',
            'peer-focus-visible:outline peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-bblue',
          )}
        >
          <span
            className={cn(
              'h-2.5 w-2.5 rounded-full transition-transform',
              checked ? 'scale-100' : 'scale-0',
              dotColor[color],
            )}
          />
        </span>
      </span>
      {label && <span className="font-sans text-base text-ink">{label}</span>}
    </label>
  )
}
