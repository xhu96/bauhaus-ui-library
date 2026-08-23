import { useState, type KeyboardEvent } from 'react'
import { cn } from '@/lib/utils'
import { type BauhausColor, type Size } from '@/lib/types'
import { useFormFieldSemantics } from './FormFieldContext'

export interface SwitchProps {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (v: boolean) => void
  disabled?: boolean
  color?: BauhausColor
  size?: Size
  className?: string
  id?: string
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
  'aria-invalid'?: boolean | 'true' | 'false'
  'aria-required'?: boolean | 'true' | 'false'
}

/** Track fill applied when the switch is on, per palette color. */
const onColor: Record<BauhausColor, string> = {
  red: 'bui-bg-bred',
  blue: 'bui-bg-bblue',
  yellow: 'bui-bg-byellow',
  ink: 'bui-bg-ink',
}

/** Track / knob geometry per size. */
const sizes: Record<Size, { track: string; knob: string; travel: string }> = {
  sm: { track: 'bui-h-7 bui-w-12', knob: 'bui-h-4 bui-w-4', travel: 'bui-translate-x-5' },
  md: { track: 'bui-h-8 bui-w-14', knob: 'bui-h-5 bui-w-5', travel: 'bui-translate-x-6' },
  lg: { track: 'bui-h-10 bui-w-[4.5rem]', knob: 'bui-h-6 bui-w-6', travel: 'bui-translate-x-8' },
}

/**
 * Bauhaus toggle: a thick-bordered track with a sharp square knob that slides.
 * Renders as a `role="switch"` button; toggles on click and Space/Enter.
 */
export function Switch({
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  color = 'blue',
  size = 'md',
  className,
  id,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  'aria-required': ariaRequired,
}: SwitchProps) {
  const [internal, setInternal] = useState(defaultChecked)
  const isControlled = checked !== undefined
  const on = isControlled ? checked : internal
  const semantics = useFormFieldSemantics(ariaDescribedBy)

  const toggle = () => {
    if (disabled) return
    const next = !on
    if (!isControlled) setInternal(next)
    onCheckedChange?.(next)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      toggle()
    }
  }

  const dims = sizes[size]

  return (
    <button
      type="button"
      role="switch"
      id={id ?? semantics.controlId}
      aria-checked={on}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-describedby={semantics.describedBy}
      aria-invalid={ariaInvalid ?? (semantics.invalid || undefined)}
      aria-required={ariaRequired ?? (semantics.required || undefined)}
      disabled={disabled}
      onClick={toggle}
      onKeyDown={onKeyDown}
      className={cn(
        'bui-reset',
        'bui-relative bui-inline-flex bui-shrink-0 bui-items-center bui-border-3 bui-p-0.5 bui-transition-colors bui-duration-100',
        semantics.invalid ? 'bui-border-bred' : 'bui-border-ink',
        'disabled:bui-cursor-not-allowed disabled:bui-opacity-50',
        dims.track,
        on ? onColor[color] : 'bui-bg-surface',
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          'bui-reset',
          'bui-pointer-events-none bui-border-3 bui-border-ink bui-bg-surface bui-transition-transform bui-duration-100 bui-ease-out',
          dims.knob,
          on ? dims.travel : 'bui-translate-x-0',
        )}
      />
    </button>
  )
}
