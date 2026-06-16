import { useEffect, useRef, type RefObject } from 'react'

const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export function useDialogBehavior(
  open: boolean,
  panelRef: RefObject<HTMLElement>,
  onClose: () => void,
) {
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!open || !panelRef.current) return

    const panel = panelRef.current
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const appRoot = document.getElementById('root')
    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'
    appRoot?.setAttribute('inert', '')

    const focusable = () => Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
    ;(focusable()[0] ?? panel).focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCloseRef.current()
        return
      }

      if (event.key !== 'Tab') return

      const items = focusable()
      if (items.length === 0) {
        event.preventDefault()
        panel.focus()
        return
      }

      const first = items[0]
      const last = items[items.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      appRoot?.removeAttribute('inert')
      previousFocus?.focus()
    }
  }, [open, panelRef])
}
