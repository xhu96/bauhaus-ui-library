import { useEffect, useRef, type RefObject } from 'react'

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

let openDialogCount = 0
let previousBodyOverflow = ''
const dialogStack: HTMLElement[] = []
const originalInertState = new Map<HTMLElement, boolean>()

function bodyChildContaining(element: HTMLElement): HTMLElement | null {
  let current: HTMLElement | null = element
  while (current?.parentElement && current.parentElement !== document.body) {
    current = current.parentElement
  }
  return current?.parentElement === document.body ? current : null
}

function applyBackgroundInert() {
  const topPanel = dialogStack[dialogStack.length - 1]
  const activePortal = topPanel ? bodyChildContaining(topPanel) : null

  Array.from(document.body.children).forEach((child) => {
    if (!(child instanceof HTMLElement)) return
    if (!originalInertState.has(child)) {
      originalInertState.set(child, child.hasAttribute('inert'))
    }

    if (child === activePortal) {
      if (originalInertState.get(child)) child.setAttribute('inert', '')
      else child.removeAttribute('inert')
    } else {
      child.setAttribute('inert', '')
    }
  })
}

function restoreBackgroundInert() {
  for (const [element, wasInert] of originalInertState) {
    if (!element.isConnected) continue
    if (wasInert) element.setAttribute('inert', '')
    else element.removeAttribute('inert')
  }
  originalInertState.clear()
}

export function useDialogBehavior(open: boolean, panelRef: RefObject<HTMLElement>, onClose: () => void) {
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!open || !panelRef.current) return

    const panel = panelRef.current
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null

    if (openDialogCount === 0) {
      previousBodyOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    }
    openDialogCount++
    dialogStack.push(panel)
    applyBackgroundInert()

    const focusable = () => Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
    ;(focusable()[0] ?? panel).focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (dialogStack[dialogStack.length - 1] !== panel) return

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
      const index = dialogStack.indexOf(panel)
      const wasTopmost = index === dialogStack.length - 1
      if (index !== -1) dialogStack.splice(index, 1)

      openDialogCount = Math.max(0, openDialogCount - 1)
      if (openDialogCount === 0) {
        document.body.style.overflow = previousBodyOverflow
        restoreBackgroundInert()
      } else {
        applyBackgroundInert()
      }

      if (wasTopmost) previousFocus?.focus()
    }
  }, [open, panelRef])
}
