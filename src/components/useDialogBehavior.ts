import { useEffect, useRef, type RefObject } from 'react'
import { isFocusable, tabbable } from 'tabbable'
import { activeDialog, registerDialog } from './dialogLayers'

export function useDialogBehavior(
  open: boolean,
  panelRef: RefObject<HTMLElement>,
  onClose: () => void,
  portalContainer?: HTMLElement | null,
) {
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!open || !panelRef.current) return
    const panel = panelRef.current
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const unregister = registerDialog(panel)
    const focusFirst = () => (tabbable(panel)[0] ?? panel).focus({ preventScroll: true })
    focusFirst()

    const onFocusIn = (event: FocusEvent) => {
      if (activeDialog() === panel && !panel.contains(event.target as Node)) focusFirst()
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (activeDialog() !== panel || event.defaultPrevented) return
      if (event.key === 'Escape') {
        event.preventDefault()
        onCloseRef.current()
      } else if (event.key === 'Tab') {
        const items = tabbable(panel)
        const index = items.indexOf(document.activeElement as HTMLElement)
        // Own every step: native Tab settings may skip buttons inside a dialog.
        event.preventDefault()
        const nextIndex =
          index < 0
            ? event.shiftKey
              ? items.length - 1
              : 0
            : (index + (event.shiftKey ? -1 : 1) + items.length) % items.length
        ;(items[nextIndex] ?? panel).focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('focusin', onFocusIn)
    return () => {
      const wasActive = activeDialog() === panel
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('focusin', onFocusIn)
      unregister()
      if (!wasActive) return
      const parent = activeDialog()
      if (
        previousFocus?.isConnected &&
        isFocusable(previousFocus) &&
        (!parent || parent.contains(previousFocus))
      ) {
        previousFocus.focus({ preventScroll: true })
      } else if (parent) {
        ;(tabbable(parent)[0] ?? parent).focus({ preventScroll: true })
      } else {
        // Removed trigger: restore a stable document focus without adding a tab stop.
        const oldTabIndex = document.body.getAttribute('tabindex')
        document.body.tabIndex = -1
        document.body.focus({ preventScroll: true })
        if (oldTabIndex === null) document.body.removeAttribute('tabindex')
        else document.body.setAttribute('tabindex', oldTabIndex)
      }
    }
  }, [open, panelRef, portalContainer])
}
