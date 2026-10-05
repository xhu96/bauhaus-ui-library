import { describe, expect, it, vi } from 'vitest'
import { applySiteTheme } from '../site/theme'

describe('browser storage test environment', () => {
  it('uses the current jsdom real Storage rather than the Node global', () => {
    for (const storage of [window.localStorage, window.sessionStorage]) {
      expect(storage).toBeInstanceOf(Storage)
      storage.setItem('storage-probe', 'value')
      expect(storage.getItem('storage-probe')).toBe('value')
      storage.removeItem('storage-probe')
    }
  })

  it.each(['missing', 'invalid', 'blocked'] as const)('still allows %s storage behavior', (kind) => {
    const descriptor = Object.getOwnPropertyDescriptor(window, 'localStorage')!
    try {
      if (kind === 'blocked') {
        vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
          throw new Error('blocked')
        })
      } else {
        Object.defineProperty(window, 'localStorage', {
          configurable: true,
          value: kind === 'missing' ? undefined : {},
        })
      }
      expect(() => applySiteTheme('dark')).not.toThrow()
      expect(document.documentElement.dataset.buiTheme).toBe('dark')
    } finally {
      Object.defineProperty(window, 'localStorage', descriptor)
      vi.restoreAllMocks()
      document.documentElement.removeAttribute('data-bui-theme')
      document.documentElement.classList.remove('dark')
    }
  })
})
