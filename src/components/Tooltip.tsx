import {
  useEffect,
  useId,
  useRef,
  useState,
  cloneElement,
  isValidElement,
  type ReactNode,
  type ReactElement,
} from 'react'
import { cn } from '@/lib/utils'

type Side = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipProps {
  content: ReactNode
  children: ReactNode
  side?: Side
  /** Delay before showing, in milliseconds. */
  delay?: number
}

const sidePosition: Record<Side, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
}

/**
 * Thick-bordered tooltip that appears on hover and keyboard focus.
 * Positioned relative to its trigger; no portal required.
 */
export function Tooltip({ content, children, side = 'top', delay = 150 }: TooltipProps) {
  const [open, setOpen] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>()
  const id = useId()

  useEffect(() => () => clearTimeout(timer.current), [])

  const show = () => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setOpen(true), delay)
  }
  const hide = () => {
    clearTimeout(timer.current)
    setOpen(false)
  }

  const trigger = isValidElement(children)
    ? cloneElement(children as ReactElement, { 'aria-describedby': open ? id : undefined })
    : children

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {trigger}
      {open && (
        <span
          role="tooltip"
          id={id}
          className={cn(
            'pointer-events-none absolute z-50 w-max max-w-xs animate-pop-in border-3 border-ink bg-ink px-2.5 py-1.5',
            'font-display text-xs font-semibold leading-snug text-paper shadow-hard-sm',
            sidePosition[side],
          )}
        >
          {content}
        </span>
      )}
    </span>
  )
}
