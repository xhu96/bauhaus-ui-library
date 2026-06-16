import { describe, expect, it } from 'vitest'
import globals from './globals.css?raw'
import tokens from './tokens.css?raw'

describe('accessibility styles', () => {
  it('defines reduced-motion behavior', () => {
    expect(globals).toContain('@media (prefers-reduced-motion: reduce)')
    expect(globals).toContain('animation-duration: 0.01ms')
    expect(globals).toContain('transition-duration: 0.01ms')
  })

  it('defines theme-aware semantic foreground colors', () => {
    expect(tokens).toContain('--bui-red-ink:')
    expect(tokens).toContain('--bui-yellow-ink:')
    expect(tokens.match(/--bui-red-ink:/g)).toHaveLength(2)
    expect(tokens.match(/--bui-yellow-ink:/g)).toHaveLength(2)
  })
})
