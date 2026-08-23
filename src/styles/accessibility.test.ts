import postcss from 'postcss'
import tailwindcss from 'tailwindcss'
import { describe, expect, it } from 'vitest'
import tailwindConfig from '../../tailwind.config'
import globals from './globals.css?raw'
import tokens from './tokens.css?raw'

describe('accessibility styles', () => {
  it('defines reduced-motion behavior', () => {
    expect(globals).toContain('@media (prefers-reduced-motion: reduce)')
    expect(globals).toContain('animation-duration: 0.01ms')
    expect(globals).toContain('transition-duration: 0.01ms')
  })

  it('keeps the distributed stylesheet free of global Tailwind Preflight', () => {
    expect(globals).not.toContain('@tailwind base')
    expect(globals).toContain('.bui-reset')
    expect(globals).toContain('border-style: solid')
    expect(globals).not.toContain('*::before')
  })

  it('namespaces generated utilities and interaction helpers', async () => {
    const result = await postcss([
      tailwindcss({
        ...tailwindConfig,
        content: [
          {
            raw: '<div class="bui-reset bui-flex bui-hidden flex hidden bui-press bui-press-hard"></div>',
            extension: 'html',
          },
        ],
      }),
    ]).process(globals, { from: undefined })

    expect(result.css).toContain('.bui-flex')
    expect(result.css).toContain('.bui-hidden')
    expect(result.css).toContain('.bui-press')
    expect(result.css).not.toMatch(/(^|})\.flex(?=[,{])/)
    expect(result.css).not.toMatch(/(^|})\.hidden(?=[,{])/)
    expect(result.css).not.toMatch(/(^|})\.press(?=[,{:])/)
  })

  it('defines theme-aware semantic foreground colors', () => {
    expect(tokens).toContain('--bui-red-ink:')
    expect(tokens).toContain('--bui-yellow-ink:')
    expect(tokens.match(/--bui-red-ink:/g)).toHaveLength(2)
    expect(tokens.match(/--bui-yellow-ink:/g)).toHaveLength(2)
  })
})
