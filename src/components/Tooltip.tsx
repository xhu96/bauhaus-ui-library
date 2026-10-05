import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import { useActiveDialog } from './dialogLayers'

export type Side = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipProps {
  /** Descriptive, non-interactive content only. */
  content: ReactNode
  children: ReactNode
  side?: Side
  /** Delay before showing, in milliseconds. */
  delay?: number
  /** Same-document themed host outside transformed/clipping ancestors. An active dialog takes precedence. */
  portalContainer?: HTMLElement | null
}

const FOCUSABLE_SELECTOR =
  'button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),summary,[contenteditable="true"],[tabindex]:not([tabindex="-1"])'

const usePortalLayoutEffect = typeof document === 'undefined' ? useEffect : useLayoutEffect

/** Hoverable descriptive tooltip, with Escape dismissal and viewport collision handling. */
export function Tooltip({ content, children, side = 'top', delay = 150, portalContainer }: TooltipProps) {
  const [open, setOpen] = useState(false)
  const [wrapperFocusable, setWrapperFocusable] = useState(false)
  const [focusedTrigger, setFocusedTrigger] = useState<HTMLElement | null>(null)
  const [position, setPosition] = useState({ left: 0, top: 0 })
  const timer = useRef<ReturnType<typeof setTimeout>>()
  const triggerRef = useRef<HTMLSpanElement>(null)
  const tooltipRef = useRef<HTMLSpanElement>(null)
  const interaction = useRef({ trigger: false, tooltip: false, focus: false, dismissed: false })
  const id = useId()
  const active = useActiveDialog()

  useEffect(() => () => clearTimeout(timer.current), [])

  useEffect(() => {
    if (active && !active.contains(triggerRef.current)) {
      clearTimeout(timer.current)
      setOpen(false)
      interaction.current = { trigger: false, tooltip: false, focus: false, dismissed: false }
    }
  }, [active])

  usePortalLayoutEffect(() => {
    const firstTarget = triggerRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR) ?? null
    const target =
      focusedTrigger && triggerRef.current?.contains(focusedTrigger) ? focusedTrigger : firstTarget
    setWrapperFocusable(!firstTarget)
    if (!target || !open) return
    const descriptions = target.getAttribute('aria-describedby')?.split(/\s+/).filter(Boolean) ?? []
    target.setAttribute('aria-describedby', [...new Set([...descriptions, id])].join(' '))
    return () => {
      // Remove only this tooltip's ID: consumers may change other descriptions
      // while the tooltip is open, or focus may move to another child control.
      const remaining =
        target
          .getAttribute('aria-describedby')
          ?.split(/\s+/)
          .filter((value) => value && value !== id) ?? []
      if (remaining.length) target.setAttribute('aria-describedby', remaining.join(' '))
      else target.removeAttribute('aria-describedby')
    }
  }, [children, focusedTrigger, id, open])

  usePortalLayoutEffect(() => {
    if (!open) return
    const update = () => {
      const anchor =
        focusedTrigger && triggerRef.current?.contains(focusedTrigger) ? focusedTrigger : triggerRef.current
      const trigger = anchor?.getBoundingClientRect()
      const tip = tooltipRef.current?.getBoundingClientRect()
      if (!trigger || !tip) return
      const viewport = window.visualViewport
      const width = viewport?.width ?? window.innerWidth
      const height = viewport?.height ?? window.innerHeight
      const originX = viewport?.offsetLeft ?? 0
      const originY = viewport?.offsetTop ?? 0
      const gap = 8
      let placement = side
      if (side === 'top' && trigger.top - tip.height - gap < originY) placement = 'bottom'
      if (side === 'bottom' && trigger.bottom + tip.height + gap > originY + height) placement = 'top'
      if (side === 'left' && trigger.left - tip.width - gap < originX) placement = 'right'
      if (side === 'right' && trigger.right + tip.width + gap > originX + width) placement = 'left'
      let left = trigger.left + (trigger.width - tip.width) / 2
      let top = trigger.top + (trigger.height - tip.height) / 2
      if (placement === 'top') top = trigger.top - tip.height - gap
      if (placement === 'bottom') top = trigger.bottom + gap
      if (placement === 'left') left = trigger.left - tip.width - gap
      if (placement === 'right') left = trigger.right + gap
      setPosition({
        left: Math.max(originX + gap, Math.min(left, originX + width - tip.width - gap)),
        top: Math.max(originY + gap, Math.min(top, originY + height - tip.height - gap)),
      })
    }
    update()
    const resize = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(update)
    if (tooltipRef.current) resize?.observe(tooltipRef.current)
    if (triggerRef.current) resize?.observe(triggerRef.current)
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    window.visualViewport?.addEventListener('resize', update)
    window.visualViewport?.addEventListener('scroll', update)
    return () => {
      resize?.disconnect()
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
      window.visualViewport?.removeEventListener('resize', update)
      window.visualViewport?.removeEventListener('scroll', update)
    }
  }, [open, side, content, active, portalContainer, focusedTrigger])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return
      if (active && !active.contains(triggerRef.current)) return
      event.preventDefault()
      event.stopPropagation()
      clearTimeout(timer.current)
      interaction.current.dismissed = true
      interaction.current.tooltip = false
      setOpen(false)
    }
    // Capture before a dialog's document bubble listener so one Escape closes
    // the tooltip only, independent of listener registration order.
    document.addEventListener('keydown', onKeyDown, true)
    return () => document.removeEventListener('keydown', onKeyDown, true)
  }, [open, active])

  const enter = (kind: 'trigger' | 'tooltip' | 'focus') => {
    const state = interaction.current
    if (!state.trigger && !state.tooltip && !state.focus) state.dismissed = false
    state[kind] = true
    clearTimeout(timer.current)
    if (!state.dismissed && !open) timer.current = setTimeout(() => setOpen(true), Math.max(0, delay))
  }
  const leave = (kind: 'trigger' | 'tooltip' | 'focus') => {
    const state = interaction.current
    state[kind] = false
    if (state.trigger || state.tooltip || state.focus) return
    clearTimeout(timer.current)
    timer.current = setTimeout(
      () => {
        setOpen(false)
        state.dismissed = false
      },
      kind === 'focus' ? 0 : 150,
    )
  }

  return (
    <>
      <span
        ref={triggerRef}
        className="bui-reset bui-relative bui-inline-flex"
        tabIndex={wrapperFocusable ? 0 : undefined}
        aria-describedby={wrapperFocusable && open ? id : undefined}
        onMouseEnter={() => enter('trigger')}
        onMouseLeave={() => leave('trigger')}
        onFocus={(event) => {
          setFocusedTrigger(event.target === event.currentTarget ? null : (event.target as HTMLElement))
          enter('focus')
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setFocusedTrigger(null)
            leave('focus')
          }
        }}
      >
        {children}
      </span>
      {open &&
        createPortal(
          <span
            ref={tooltipRef}
            role="tooltip"
            id={id}
            onMouseEnter={() => enter('tooltip')}
            onMouseLeave={() => leave('tooltip')}
            style={{ ...position, maxWidth: 'min(20rem, calc(100vw - 1rem))' }}
            className={cn(
              'bui-reset',
              'bui-fixed bui-z-[70] bui-w-max bui-border-3 bui-border-ink bui-bg-ink bui-px-2.5 bui-py-1.5',
              'bui-font-display bui-text-xs bui-font-semibold bui-leading-snug bui-text-paper bui-shadow-hard-sm',
            )}
          >
            {content}
          </span>,
          active ?? portalContainer ?? document.body,
        )}
    </>
  )
}
