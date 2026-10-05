import { render, screen } from '@testing-library/react'
import postcss from 'postcss'
import autoprefixer from 'autoprefixer'
import { expect, it } from 'vitest'
import BauPage from '../BauPage'
import bauStyles from '../styles/bau.css?raw'

it('gives the preview installation link a theme color in both link states', async () => {
  render(<BauPage />)
  const link = screen.getByRole('link', { name: 'Install the local preview' })
  const compiled = await postcss([autoprefixer]).process(bauStyles, { from: undefined })

  // Inspect emitted CSS on the rendered anchor. Browsers intentionally hide
  // visited history from getComputedStyle, so match that state explicitly here.
  // Actual dark-theme pixels/contrast are checked by the controller in CUA.
  for (const visited of [false, true]) {
    let color: string | undefined
    compiled.root.walkRules((rule) => {
      if (rule.parent?.type === 'atrule') return
      const matches = rule.selectors.some((selector) => {
        if (selector.includes(':visited') && !visited) return false
        if (selector.includes(':link') && visited) return false
        return link.matches(selector.replace(/:visited|:link/g, ''))
      })
      if (matches)
        rule.walkDecls('color', (declaration) => {
          color = declaration.value
        })
    })
    expect(color, visited ? 'visited link' : 'unvisited link').toBe('var(--bau-ink)')
  }
})
