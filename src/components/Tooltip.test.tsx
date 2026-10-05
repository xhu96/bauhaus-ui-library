import { render, screen, act, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { Tooltip } from './Tooltip'
import { Button } from './Button'

describe('Tooltip', () => {
  it('moves the accessible description between focused controls and preserves caller descriptions', () => {
    const { unmount } = render(
      <Tooltip content="Shared help" delay={0}>
        <button aria-describedby="first-help">First action</button>
        <button aria-describedby="second-help">Second action</button>
      </Tooltip>,
    )
    const first = screen.getByRole('button', { name: 'First action' })
    const second = screen.getByRole('button', { name: 'Second action' })

    fireEvent.focus(first)
    act(() => vi.advanceTimersByTime(0))
    const tooltip = screen.getByRole('tooltip')
    expect(first).toHaveAttribute('aria-describedby', `first-help ${tooltip.id}`)
    expect(second).toHaveAttribute('aria-describedby', 'second-help')

    fireEvent.blur(first, { relatedTarget: second })
    fireEvent.focus(second, { relatedTarget: first })
    expect(first).toHaveAttribute('aria-describedby', 'first-help')
    expect(second).toHaveAttribute('aria-describedby', `second-help ${tooltip.id}`)
    expect(screen.getByRole('tooltip')).toBe(tooltip)

    fireEvent.keyDown(second, { key: 'Escape' })
    expect(second).toHaveAttribute('aria-describedby', 'second-help')

    fireEvent.blur(second)
    act(() => vi.advanceTimersByTime(0))
    fireEvent.focus(second)
    act(() => vi.advanceTimersByTime(0))
    second.setAttribute('aria-describedby', `second-help added-help ${screen.getByRole('tooltip').id}`)
    unmount()
    expect(second).toHaveAttribute('aria-describedby', 'second-help added-help')
  })

  it.each(['hover-to-focus', 'focus-to-hover'] as const)(
    'preserves the pending opening delay during a %s handoff',
    (handoff) => {
      render(
        <Tooltip content="Pending help" delay={150}>
          <button>Help</button>
        </Tooltip>,
      )
      const button = screen.getByRole('button')
      const trigger = button.parentElement!
      if (handoff === 'hover-to-focus') {
        fireEvent.mouseEnter(trigger)
        fireEvent.focus(button)
        fireEvent.mouseLeave(trigger)
      } else {
        fireEvent.focus(button)
        fireEvent.mouseEnter(trigger)
        fireEvent.blur(button)
      }
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
      act(() => vi.advanceTimersByTime(149))
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
      act(() => vi.advanceTimersByTime(1))
      expect(screen.getByRole('tooltip')).toHaveTextContent('Pending help')
    },
  )

  it('flips and clamps coordinates at a viewport edge in a supplied portal host', () => {
    const host = document.createElement('div')
    host.setAttribute('data-bui-theme', 'dark')
    document.body.append(host)
    const geometry = vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: Element,
    ) {
      return this.getAttribute('role') === 'tooltip' ? new DOMRect(0, 0, 120, 30) : new DOMRect(1, 1, 20, 20)
    })
    render(
      <Tooltip content="Info" delay={0} portalContainer={host}>
        <button>Help</button>
      </Tooltip>,
    )
    fireEvent.focus(screen.getByRole('button'))
    act(() => vi.advanceTimersByTime(0))
    const tip = screen.getByRole('tooltip')
    expect(tip.parentElement).toBe(host)
    expect(tip.style.left).toBe('8px')
    expect(tip.style.top).toBe('29px')
    geometry.mockRestore()
  })

  it('keeps a focused tooltip open across pointer exit and dismissed until focus is renewed', () => {
    render(
      <Tooltip content="Info" delay={0}>
        <button>Help</button>
      </Tooltip>,
    )
    const button = screen.getByRole('button')
    fireEvent.focus(button)
    act(() => vi.advanceTimersByTime(0))
    fireEvent.mouseEnter(button.parentElement!)
    fireEvent.mouseLeave(button.parentElement!)
    act(() => vi.advanceTimersByTime(200))
    expect(screen.getByRole('tooltip')).toBeInTheDocument()
    fireEvent.keyDown(button, { key: 'Escape' })
    fireEvent.mouseEnter(button.parentElement!)
    act(() => vi.advanceTimersByTime(200))
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    fireEvent.mouseLeave(button.parentElement!)
    fireEvent.blur(button)
    act(() => vi.advanceTimersByTime(0))
    fireEvent.focus(button)
    act(() => vi.advanceTimersByTime(0))
    expect(screen.getByRole('tooltip')).toBeInTheDocument()
  })
  it('dismisses with Escape until the next activation and allows hover handoff', () => {
    render(
      <Tooltip content="Details" delay={100}>
        <button>Help</button>
      </Tooltip>,
    )
    const trigger = screen.getByRole('button').parentElement!
    fireEvent.mouseEnter(trigger)
    act(() => vi.advanceTimersByTime(100))
    const tooltip = screen.getByRole('tooltip')
    expect(tooltip.parentElement).toBe(document.body)
    fireEvent.mouseLeave(trigger)
    fireEvent.mouseEnter(tooltip)
    act(() => vi.advanceTimersByTime(200))
    expect(screen.getByRole('tooltip')).toBeInTheDocument()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    act(() => vi.advanceTimersByTime(200))
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    fireEvent.mouseLeave(tooltip)
    fireEvent.mouseEnter(trigger)
    act(() => vi.advanceTimersByTime(100))
    expect(screen.getByRole('tooltip')).toBeInTheDocument()
  })
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
    act(() => vi.advanceTimersByTime(150))

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
