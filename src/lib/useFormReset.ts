import { useEffect, useRef, type RefObject } from 'react'

/** Run after native reset and its cancellable handlers, including external forms. */
export function useFormReset(ref: RefObject<HTMLInputElement>, reset: () => void) {
  const latestReset = useRef(reset)
  useEffect(() => {
    latestReset.current = reset
  })
  useEffect(() => {
    const input = ref.current
    if (!input) return
    let active = true
    const onReset = (event: Event) => {
      if (event.target !== input.form) return
      queueMicrotask(() => {
        if (active && !event.defaultPrevented) latestReset.current()
      })
    }
    input.ownerDocument.addEventListener('reset', onReset, true)
    return () => {
      active = false
      input.ownerDocument.removeEventListener('reset', onReset, true)
    }
  }, [ref])
}
