import { useSyncExternalStore } from 'react'

const panels: HTMLElement[] = []
const listeners = new Set<() => void>()
const originalInert = new Map<HTMLElement, string | null>()
let overflow = ''
let observer: MutationObserver | undefined

export const activeDialog = () => panels[panels.length - 1] ?? null
const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
export const useActiveDialog = () => useSyncExternalStore(subscribe, activeDialog, () => null)

function restoreInert() {
  originalInert.forEach((value, element) => {
    if (value === null) element.removeAttribute('inert')
    else element.setAttribute('inert', value)
  })
  originalInert.clear()
}

function isolate() {
  // Walk every ancestor branch so local portal siblings are isolated too.
  restoreInert()
  let branch = activeDialog()
  while (branch && branch !== document.body) {
    originalInert.set(branch, branch.getAttribute('inert'))
    branch.removeAttribute('inert')
    const parent = branch.parentElement
    if (!parent) break
    for (const sibling of Array.from(parent.children)) {
      if (sibling === branch || !(sibling instanceof HTMLElement)) continue
      originalInert.set(sibling, sibling.getAttribute('inert'))
      sibling.setAttribute('inert', '')
    }
    branch = parent
  }
}

export function registerDialog(panel: HTMLElement) {
  if (!panels.length) {
    overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    observer = new MutationObserver(isolate)
    observer.observe(document.body, { childList: true, subtree: true })
  }
  panels.push(panel)
  isolate()
  listeners.forEach((listener) => listener())
  return () => {
    const index = panels.indexOf(panel)
    if (index < 0) return
    panels.splice(index, 1)
    if (!panels.length) {
      observer?.disconnect()
      observer = undefined
      document.body.style.overflow = overflow
      restoreInert()
    } else isolate()
    listeners.forEach((listener) => listener())
  }
}
