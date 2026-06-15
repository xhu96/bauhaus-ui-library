import { forwardRef, type InputHTMLAttributes } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type BauhausColor } from '@/lib/types'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  color?: BauhausColor
}

/** Background applied to the custom box when checked, per palette color. */
const checkedFill: Record<BauhausColor, string> = {
  red: 'peer-checked:bg-bred',
  blue: 'peer-checked:bg-bblue',
  yellow: 'peer-checked:bg-byellow',
  ink: 'peer-checked:bg-ink',
}

/** Check-icon color so it stays legible on the fill. */
const checkColor: Record<BauhausColor, string> = {
  red: 'text-white',
  blue: 'text-white',
  yellow: 'text-coal',
  ink: 'text-paper',
}

/**
 * Custom checkbox: a visually-hidden native input drives a 3px-bordered square
 * that fills with the chosen color and reveals a Check icon when selected.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, color = 'ink', className, disabled, id, ...props },
  ref,
) {
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
          ref={ref}
          id={id}
          type="checkbox"
          disabled={disabled}
          className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
          {...props}
        />
        <span
          aria-hidden
          className={cn(
            'pointer-events-none flex h-6 w-6 items-center justify-center border-3 border-ink bg-surface',
            'peer-focus-visible:outline peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-bblue',
            'peer-checked:[&>svg]:opacity-100',
            checkedFill[color],
          )}
        >
          <Check className={cn('h-4 w-4 opacity-0 [stroke-width:3]', checkColor[color])} />
        </span>
      </span>
      {label && <span className="font-sans text-base text-ink">{label}</span>}
    </label>
  )
})
