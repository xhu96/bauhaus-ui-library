import { useState, type KeyboardEvent } from 'react'
import { cn } from '@/lib/utils'
import { type BauhausColor, type Size } from '@/lib/types'

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
}

/** Track fill applied when the switch is on, per palette color. */
const onColor: Record<BauhausColor, string> = {
  red: 'bg-bred',
  blue: 'bg-bblue',
  yellow: 'bg-byellow',
  ink: 'bg-ink',
}

/** Track / knob geometry per size. */
const sizes: Record<Size, { track: string; knob: string; travel: string }> = {
  sm: { track: 'h-7 w-12', knob: 'h-4 w-4', travel: 'translate-x-5' },
  md: { track: 'h-8 w-14', knob: 'h-5 w-5', travel: 'translate-x-6' },
  lg: { track: 'h-10 w-[4.5rem]', knob: 'h-6 w-6', travel: 'translate-x-8' },
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
}: SwitchProps) {
  const [internal, setInternal] = useState(defaultChecked)
  const isControlled = checked !== undefined
  const on = isControlled ? checked : internal

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
      id={id}
      aria-checked={on}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      disabled={disabled}
      onClick={toggle}
      onKeyDown={onKeyDown}
      className={cn(
        'relative inline-flex shrink-0 items-center border-3 border-ink p-0.5 transition-colors duration-100',
        'disabled:cursor-not-allowed disabled:opacity-50',
        dims.track,
        on ? onColor[color] : 'bg-surface',
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          'pointer-events-none border-3 border-ink bg-surface transition-transform duration-100 ease-out',
          dims.knob,
          on ? dims.travel : 'translate-x-0',
        )}
      />
    </button>
  )
}
