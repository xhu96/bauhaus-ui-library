import { render, screen, act, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { Tooltip } from './Tooltip'
import { Button } from './Button'

describe('Tooltip', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('displays tooltip content on hover after delay', () => {
    render(
      <Tooltip content="Helpful information" delay={150}>
        <Button>Hover me</Button>
      </Tooltip>,
    )

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()

    const trigger = screen.getByRole('button', { name: 'Hover me' }).parentElement!
    fireEvent.mouseEnter(trigger)

    act(() => {
      vi.advanceTimersByTime(200)
    })

    const tooltip = screen.getByRole('tooltip')
    expect(tooltip).toBeInTheDocument()
    expect(tooltip).toHaveTextContent('Helpful information')

    fireEvent.mouseLeave(trigger)

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('preserves existing aria-describedby on child element', () => {
    render(
      <Tooltip content="Tooltip message">
        <Button aria-describedby="existing-id">Described Button</Button>
      </Tooltip>,
    )

    const button = screen.getByRole('button', { name: 'Described Button' })
    expect(button.getAttribute('aria-describedby')).toBe('existing-id')

    const trigger = button.parentElement!
    fireEvent.mouseEnter(trigger)

    act(() => {
      vi.advanceTimersByTime(200)
    })

    const tooltip = screen.getByRole('tooltip')
    expect(button.getAttribute('aria-describedby')).toContain('existing-id')
    expect(button.getAttribute('aria-describedby')).toContain(tooltip.id)
  })

  it('makes text-only triggers focusable with tabIndex 0', () => {
    render(<Tooltip content="Information">Plain text trigger</Tooltip>)

    const textSpan = screen.getByText('Plain text trigger')
    expect(textSpan).toHaveAttribute('tabindex', '0')
  })

  it('treats an anchor without href as non-focusable', () => {
    render(
      <Tooltip content="Information">
        <a>Not a link yet</a>
      </Tooltip>,
    )

    const anchor = screen.getByText('Not a link yet')
    expect(anchor).not.toHaveAttribute('tabindex')
    expect(anchor.parentElement).toHaveAttribute('tabindex', '0')
  })

  it('does not add a second tab stop around a custom component that renders a button', () => {
    render(
      <Tooltip content="Information">
        <Button>Focusable child</Button>
      </Tooltip>,
    )

    const button = screen.getByRole('button', { name: 'Focusable child' })
    expect(button.parentElement).not.toHaveAttribute('tabindex')
  })

  it('makes non-focusable React elements focusable with tabIndex 0', () => {
    render(
      <Tooltip content="Information">
        <span>Help</span>
      </Tooltip>,
    )

    const text = screen.getByText('Help')
    // The wrapping span or the element itself should have tabIndex 0
    expect(text.closest('[tabindex="0"]')).toBeInTheDocument()
  })
})
