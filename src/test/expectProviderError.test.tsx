import { render } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { Radio } from '../components/Radio'
import { expectProviderError } from './expectProviderError'

it('forwards unrelated diagnostics and restores handlers even when its assertion fails', () => {
  const previousError = console.error
  const forwarded: unknown[][] = []
  const capture = (...args: unknown[]) => {
    forwarded.push(args)
  }
  console.error = capture
  const remove = vi.spyOn(window, 'removeEventListener')
  try {
    expect(() =>
      expectProviderError(
        () => {
          console.error('unrelated diagnostic')
          const unrelated = new ErrorEvent('error', {
            cancelable: true,
            message: 'unrelated error',
            error: new Error('unrelated error'),
          })
          // Installed after the helper: observe whether it canceled an unknown event.
          const observe = (event: ErrorEvent) => {
            expect(event.defaultPrevented).toBe(false)
            event.preventDefault()
          }
          window.addEventListener('error', observe, { once: true })
          window.dispatchEvent(unrelated)
          render(<Radio value="orphan" />)
        },
        'Radio must be used within a RadioGroup',
        'WrongComponent',
      ),
    ).toThrow()
    expect(forwarded[0]).toEqual(['unrelated diagnostic'])
    expect(forwarded.some(([value]) => String(value).includes('<ForwardRef(Radio2)>'))).toBe(true)
    expect(console.error).toBe(capture)
    expect(remove).toHaveBeenCalledWith('error', expect.any(Function))
  } finally {
    remove.mockRestore()
    console.error = previousError
  }
})
