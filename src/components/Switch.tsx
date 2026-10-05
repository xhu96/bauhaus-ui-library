import { forwardRef, useImperativeHandle, useRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { type BauhausColor, type Size } from '@/lib/types'
import { useFormFieldSemantics } from './FormFieldContext'
import { useFormReset } from '@/lib/useFormReset'

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'color'> {
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
  red: 'peer-checked:bui-bg-bred',
  blue: 'peer-checked:bui-bg-bblue',
  yellow: 'peer-checked:bui-bg-byellow',
  ink: 'peer-checked:bui-bg-ink',
}

/** Track / knob geometry per size. */
const sizes: Record<Size, { track: string; knob: string; travel: string }> = {
  sm: {
    track: 'bui-h-7 bui-w-12',
    knob: 'bui-h-4 bui-w-4',
    travel: 'peer-checked:[&>span]:bui-translate-x-5',
  },
  md: {
    track: 'bui-h-8 bui-w-14',
    knob: 'bui-h-5 bui-w-5',
    travel: 'peer-checked:[&>span]:bui-translate-x-6',
  },
  lg: {
    track: 'bui-h-10 bui-w-[4.5rem]',
    knob: 'bui-h-6 bui-w-6',
    travel: 'peer-checked:[&>span]:bui-translate-x-8',
  },
}

/**
 * Bauhaus toggle: a thick-bordered track with a sharp square knob that slides.
 * Uses a native checkbox with switch semantics; supports forms, refs, reset,
 * validation, native Space activation and Enter activation.
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  {
    checked,
    defaultChecked = false,
    onCheckedChange,
    disabled = false,
    color = 'blue',
    size = 'md',
    className,
    id,
    required,
    onChange,
    onKeyDown,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid,
    'aria-required': ariaRequired,
    ...props
  },
  ref,
) {
  const inputRef = useRef<HTMLInputElement>(null)
  useImperativeHandle(ref, () => inputRef.current!)
  const isControlled = checked !== undefined
  const semantics = useFormFieldSemantics(ariaDescribedBy)

  useFormReset(inputRef, () => {
    if (isControlled && inputRef.current) inputRef.current.checked = checked
  })

  const dims = sizes[size]

  return (
    <span className={cn('bui-reset bui-relative bui-inline-flex bui-shrink-0', dims.track, className)}>
      <input
        {...props}
        ref={inputRef}
        type="checkbox"
        role="switch"
        id={id ?? semantics.controlId}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby ?? (ariaLabel ? undefined : semantics.labelId)}
        aria-describedby={semantics.describedBy}
        aria-invalid={ariaInvalid ?? (semantics.invalid || undefined)}
        aria-required={ariaRequired ?? required ?? (semantics.required || undefined)}
        required={required ?? (semantics.required || undefined)}
        disabled={disabled}
        checked={checked}
        defaultChecked={isControlled ? undefined : defaultChecked}
        onChange={(event) => {
          onChange?.(event)
          if (event.defaultPrevented) return
          onCheckedChange?.(event.target.checked)
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event)
          if (!event.defaultPrevented && event.key === 'Enter' && !event.currentTarget.matches(':disabled')) {
            event.preventDefault()
            event.currentTarget.click()
          }
        }}
        className="bui-reset bui-peer bui-absolute bui-inset-0 bui-m-0 bui-h-full bui-w-full bui-cursor-pointer bui-opacity-0 disabled:bui-cursor-not-allowed"
      />
      <span
        aria-hidden
        // Isolate the visual travel; native input and surrounding form keep their direction.
        dir="ltr"
        className={cn(
          'bui-reset',
          'bui-pointer-events-none bui-inline-flex bui-h-full bui-w-full bui-items-center bui-border-3 bui-p-0.5 bui-transition-colors bui-duration-100',
          semantics.invalid ? 'bui-border-bred' : 'bui-border-ink',
          'peer-disabled:bui-opacity-50 peer-focus-visible:bui-outline peer-focus-visible:bui-outline-[3px] peer-focus-visible:bui-outline-offset-2 peer-focus-visible:bui-outline-focus',
          'bui-bg-surface',
          onColor[color],
          dims.travel,
        )}
      >
        <span
          aria-hidden
          className={cn(
            'bui-reset',
            'bui-pointer-events-none bui-border-3 bui-border-ink bui-bg-surface bui-transition-transform bui-duration-100 bui-ease-out',
            dims.knob,
            'bui-translate-x-0',
          )}
        />
      </span>
    </span>
  )
})
