import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type Side = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipProps {
  content: ReactNode
  children: ReactNode
  side?: Side
  /** Delay before showing, in milliseconds. */
  delay?: number
}

const sidePosition: Record<Side, string> = {
  top: 'bui-bottom-full bui-left-1/2 -bui-translate-x-1/2 bui-mb-2',
  bottom: 'bui-top-full bui-left-1/2 -bui-translate-x-1/2 bui-mt-2',
  left: 'bui-right-full bui-top-1/2 -bui-translate-y-1/2 bui-mr-2',
  right: 'bui-left-full bui-top-1/2 -bui-translate-y-1/2 bui-ml-2',
}

const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  'a[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'summary',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

/**
 * Thick-bordered tooltip that appears on hover and keyboard focus.
 * Positioned relative to its trigger; no portal required.
 */
export function Tooltip({ content, children, side = 'top', delay = 150 }: TooltipProps) {
  const [open, setOpen] = useState(false)
  const [wrapperFocusable, setWrapperFocusable] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>()
  const triggerRef = useRef<HTMLSpanElement>(null)
  const id = useId()

  useEffect(() => () => clearTimeout(timer.current), [])

  useLayoutEffect(() => {
    const target = triggerRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR) ?? null
    setWrapperFocusable(!target)

    if (!target) return

    const original = target.getAttribute('aria-describedby')
    const merged = [original || undefined, open ? id : undefined].filter(Boolean).join(' ') || undefined
    if (merged) target.setAttribute('aria-describedby', merged)
    else target.removeAttribute('aria-describedby')

    return () => {
      if (!target.isConnected) return
      if (original) target.setAttribute('aria-describedby', original)
      else target.removeAttribute('aria-describedby')
    }
  }, [children, id, open])

  const show = () => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setOpen(true), delay)
  }
  const hide = () => {
    clearTimeout(timer.current)
    setOpen(false)
  }

  return (
    <span
      ref={triggerRef}
      className="bui-reset bui-relative bui-inline-flex"
      tabIndex={wrapperFocusable ? 0 : undefined}
      aria-describedby={wrapperFocusable && open ? id : undefined}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {open && (
        <span
          role="tooltip"
          id={id}
          className={cn(
            'bui-reset',
            'bui-pointer-events-none bui-absolute bui-z-50 bui-w-max bui-max-w-xs bui-animate-pop-in bui-border-3 bui-border-ink bui-bg-ink bui-px-2.5 bui-py-1.5',
            'bui-font-display bui-text-xs bui-font-semibold bui-leading-snug bui-text-paper bui-shadow-hard-sm',
            sidePosition[side],
          )}
        >
          {content}
        </span>
      )}
    </span>
  )
}
