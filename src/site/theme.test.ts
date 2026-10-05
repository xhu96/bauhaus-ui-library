import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import { describe, expect, it, vi } from 'vitest'

const bootstrap = readFileSync('public/site-theme.js', 'utf8')

describe('shared pre-paint theme bootstrap', () => {
  it.each(['light', 'dark', 'invalid', null, 'blocked'])(
    'resolves preference %s with a dark system preference',
    (stored) => {
      const root = document.createElement('html')
      runInNewContext(bootstrap, {
        document: { documentElement: root },
        window: {
          localStorage: {
            getItem: () => {
              if (stored === 'blocked') throw new Error('blocked')
              return stored
            },
          },
          matchMedia: vi.fn(() => ({ matches: true })),
        },
      })
      const expected = stored === 'light' ? 'light' : 'dark'
      expect(root.dataset.buiTheme).toBe(expected)
      expect(root.classList.contains('dark')).toBe(expected === 'dark')
    },
  )
})
