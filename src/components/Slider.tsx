import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { hex, type BauhausColor } from '@/lib/types'

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  color?: BauhausColor
}

/**
 * Native range input styled the Bauhaus way: thick-bordered track wrapper and a
 * palette accent color applied via `accent-color`.
 */
export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
  { color = 'red', className, style, disabled, ...props },
  ref,
) {
  return (
    <div
      className={cn(
        'flex w-full items-center border-3 border-ink bg-surface px-3 py-2.5',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      <input
        ref={ref}
        type="range"
        disabled={disabled}
        className="h-2 w-full cursor-pointer disabled:cursor-not-allowed"
        style={{ accentColor: hex[color], ...style }}
        {...props}
      />
    </div>
  )
})
