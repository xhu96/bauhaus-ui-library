import { render, screen } from '@testing-library/react'
import postcss from 'postcss'
import tailwindcss from '../../scripts/tailwind-compat.mjs'
import { expect, it } from 'vitest'
import tailwindConfig from '../../tailwind.config'
import modalSource from './Modal.tsx?raw'
import drawerSource from './Drawer.tsx?raw'
import { Modal } from './Modal'
import { Drawer } from './Drawer'

it.each([Modal, Drawer])('sets compiled semantic foreground on the owned dialog panel', async (Component) => {
  const css = await postcss([
    tailwindcss({ ...tailwindConfig, content: [{ raw: modalSource + drawerSource, extension: 'tsx' }] }),
  ]).process('@tailwind utilities;', { from: undefined })
  render(
    <Component open title="Local dark dialog" onClose={() => {}}>
      <p>Plain consumer text</p>
    </Component>,
  )
  const panel = screen.getByRole('dialog')
  let ownsForeground = false
  css.root.walkRules((rule) => {
    rule.walkDecls('color', (declaration) => {
      if (declaration.value.includes('--bui-ink)') && panel.matches(rule.selector)) ownsForeground = true
    })
  })
  expect(ownsForeground).toBe(true)
})
