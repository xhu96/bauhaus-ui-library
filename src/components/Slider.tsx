import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { hex, type BauhausColor } from '@/lib/types'
import { useFormFieldSemantics } from './FormFieldContext'

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  color?: BauhausColor
}

/**
 * Native range input styled the Bauhaus way: thick-bordered track wrapper and a
 * palette accent color applied via `accent-color`.
 */
export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
  {
    color = 'red',
    className,
    style,
    disabled,
    id,
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid,
    'aria-required': ariaRequired,
    ...props
  },
  ref,
) {
  const semantics = useFormFieldSemantics(ariaDescribedBy)

  return (
    <div
      className={cn(
        'bui-reset',
        'bui-flex bui-w-full bui-items-center bui-border-3 bui-bg-surface bui-px-3 bui-py-2',
        semantics.invalid ? 'bui-border-bred' : 'bui-border-ink',
        disabled && 'bui-cursor-not-allowed bui-opacity-50',
        className,
      )}
    >
      <input
        ref={ref}
        id={id ?? semantics.controlId}
        type="range"
        disabled={disabled}
        aria-describedby={semantics.describedBy}
        aria-required={ariaRequired}
        aria-invalid={ariaInvalid ?? (semantics.invalid || undefined)}
        className="bui-reset bui-h-11 bui-w-full bui-cursor-pointer disabled:bui-cursor-not-allowed"
        style={{ accentColor: color === 'ink' ? 'rgb(var(--bui-ink))' : hex[color], ...style }}
        {...props}
      />
    </div>
  )
})
