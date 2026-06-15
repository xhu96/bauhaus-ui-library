import { forwardRef, type SelectHTMLAttributes, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type Size } from '@/lib/types'

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
  sm: 'h-9 text-sm pl-3 pr-9',
  md: 'h-11 text-base pl-4 pr-11',
  lg: 'h-14 text-lg pl-5 pr-14',
}

const chevronPos: Record<Size, string> = {
  sm: 'right-2.5',
  md: 'right-3.5',
  lg: 'right-4',
}

/**
 * Thick-bordered native select with a custom Bauhaus chevron. Pass `options`
 * or `children` to populate the list.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { selectSize = 'md', error = false, options, className, disabled, children, ...props },
  ref,
) {
  return (
    <div className="relative inline-flex w-full items-center">
      <select
        ref={ref}
        disabled={disabled}
        aria-invalid={error || undefined}
        className={cn(
          'w-full appearance-none border-3 bg-surface font-sans text-ink',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error ? 'border-bred' : 'border-ink',
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
        className={cn('pointer-events-none absolute h-5 w-5 text-ink', chevronPos[selectSize])}
        aria-hidden
      />
    </div>
  )
})
