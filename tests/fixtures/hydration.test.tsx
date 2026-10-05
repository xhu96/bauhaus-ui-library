import { renderToString } from 'react-dom/server'
import { act, fireEvent } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { Button } from 'bauhaus-ui-library'
import { startHydrationProbe } from '../consumer/hydration-probe.jsx'

let root: ReturnType<typeof startHydrationProbe> | undefined
afterEach(() => {
  act(() => root?.unmount())
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

async function mount(serverText: string) {
  document.body.innerHTML = `<div id="hydrated">${renderToString(<Button>{serverText}</Button>)}</div><p id="hydration-status">SSR content ready</p><output id="hydration-errors">[]</output>`
  await act(async () => {
    root = startHydrationProbe(Button, document)
  })
}
const errors = () => JSON.parse(document.getElementById('hydration-errors')!.textContent!)

it('accepts matching SSR markup only with zero persistent recoverable errors after clicking', async () => {
  await mount('Hydrated button')
  fireEvent.click(document.querySelector('#hydrated button')!)
  expect(document.getElementById('hydration-status')).toHaveTextContent('Hydration click passed')
  expect(errors()).toEqual([])
})

it('rejects intentional SSR mismatch and retains recoverable errors after the working client button is clicked', async () => {
  const warnings = vi.spyOn(console, 'error').mockImplementation(() => {})
  await mount('Deliberately mismatched server text')
  expect(warnings).toHaveBeenCalled()
  const beforeClick = errors()
  fireEvent.click(document.querySelector('#hydrated button')!)
  expect(document.getElementById('hydration-status')).not.toHaveTextContent('Hydration click passed')
  expect(errors().length).toBeGreaterThan(0)
  expect(errors()).toEqual(beforeClick)
  // This is the same zero-error criterion used by the browser success gate.
  expect(() => expect(errors()).toEqual([])).toThrow()
})
