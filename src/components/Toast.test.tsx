import { render, screen, act, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { ToastProvider, useToast } from './Toast'
import { Button } from './Button'
import { StrictMode, useState } from 'react'
import { Modal } from './Modal'
import { expectProviderError } from '../test/expectProviderError'

function ToastTriggerButton() {
  const { toast } = useToast()
  return (
    <Button
      onClick={() =>
        toast({
          title: 'Changes saved',
          description: 'Your project has been updated.',
          status: 'success',
          duration: 3000,
        })
      }
    >
      Show toast
    </Button>
  )
}

describe('Toast and ToastProvider', () => {
  it('fully reveals a focused dismissal when a scroll viewport only partly contains it', () => {
    render(
      <ToastProvider>
        <ToastTriggerButton />
      </ToastProvider>,
    )
    for (let i = 0; i < 3; i++) fireEvent.click(screen.getByRole('button', { name: 'Show toast' }))
    const viewport = screen.getByRole('status')
    const dismissal = screen.getAllByRole('button', { name: 'Close' })[2]
    const viewportBounds = vi
      .spyOn(viewport, 'getBoundingClientRect')
      .mockReturnValue(new DOMRect(16, 80, 358, 224))
    const buttonBounds = vi
      .spyOn(dismissal, 'getBoundingClientRect')
      .mockReturnValue(new DOMRect(319, 282.03, 44, 44))

    fireEvent.focus(dismissal)
    expect(viewport.scrollTop).toBe(23)

    viewport.scrollTop = 60
    buttonBounds.mockReturnValue(new DOMRect(319, 60, 44, 44))
    fireEvent.focus(dismissal)
    expect(viewport.scrollTop).toBe(40)

    buttonBounds.mockReturnValue(new DOMRect(319, 140, 44, 44))
    fireEvent.focus(dismissal)
    expect(viewport.scrollTop).toBe(40)
    viewportBounds.mockRestore()
    buttonBounds.mockRestore()
  })

  it('bounds the notification viewport and preserves scrollable, non-shrinking cards', () => {
    render(
      <ToastProvider>
        <ToastTriggerButton />
      </ToastProvider>,
    )
    for (let i = 0; i < 5; i++) fireEvent.click(screen.getByRole('button', { name: 'Show toast' }))
    const viewport = screen.getByRole('status')
    expect(viewport).toHaveStyle({ maxHeight: 'calc(100dvh - 6rem)', overflowY: 'auto' })
    expect(viewport.children).toHaveLength(5)
    for (const card of viewport.children) expect(card).toHaveClass('bui-shrink-0')
  })
  it('keeps persistent notifications and honors a custom maximum and label under StrictMode', () => {
    function Trigger() {
      const { toast } = useToast()
      return <button onClick={() => toast({ title: 'Persistent', duration: 0 })}>Push</button>
    }
    const view = render(
      <StrictMode>
        <ToastProvider maxToasts={2} dismissLabel="Fermer">
          <Trigger />
        </ToastProvider>
      </StrictMode>,
    )
    for (let i = 0; i < 3; i++) fireEvent.click(screen.getByText('Push'))
    act(() => vi.advanceTimersByTime(60000))
    expect(screen.getAllByText('Persistent')).toHaveLength(2)
    expect(screen.getAllByRole('button', { name: 'Fermer' })).toHaveLength(2)
    expect(vi.getTimerCount()).toBe(0)
    view.unmount()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('preserves remaining time across dialog placement and allows dismissal inside the dialog', () => {
    function Example() {
      const [open, setOpen] = useState(false)
      const { toast } = useToast()
      return (
        <>
          <button onClick={() => toast({ title: 'Moving', duration: 3000 })}>Push</button>
          <button onClick={() => setOpen(true)}>Open</button>
          <Modal open={open} title="Editor" onClose={() => setOpen(false)} />
        </>
      )
    }
    render(
      <ToastProvider dismissLabel="Dismiss notification">
        <Example />
      </ToastProvider>,
    )
    fireEvent.click(screen.getByText('Push'))
    act(() => vi.advanceTimersByTime(1000))
    fireEvent.click(screen.getByText('Open'))
    expect(screen.getByRole('dialog')).toContainElement(
      screen.getByRole('button', { name: 'Dismiss notification' }),
    )
    act(() => vi.advanceTimersByTime(1999))
    expect(screen.getByText('Moving')).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(1))
    expect(screen.queryByText('Moving')).not.toBeInTheDocument()
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
    fireEvent.click(screen.getByText('Push'))
    fireEvent.click(screen.getByText('Open'))
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }))
    expect(screen.queryByText('Moving')).not.toBeInTheDocument()
    // jsdom schedules zero-delay selectionchange events when focus moves.
    act(() => vi.advanceTimersByTime(0))
    expect(vi.getTimerCount()).toBe(0)
  })
  it('bounds notifications at five and clears discarded timers', () => {
    function Flood() {
      const { toast } = useToast()
      return (
        <button
          onClick={() => {
            for (let i = 0; i < 8; i++) toast({ title: `Notice ${i}` })
          }}
        >
          Flood
        </button>
      )
    }
    const view = render(
      <ToastProvider>
        <Flood />
      </ToastProvider>,
    )
    fireEvent.click(screen.getByText('Flood'))
    expect(screen.queryByText('Notice 0')).not.toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Close' })).toHaveLength(5)
    expect(vi.getTimerCount()).toBe(5)
    view.unmount()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('pauses the remaining duration for hover, focus, and a hidden page', () => {
    render(
      <ToastProvider>
        <ToastTriggerButton />
      </ToastProvider>,
    )
    fireEvent.click(screen.getByText('Show toast'))
    act(() => vi.advanceTimersByTime(1000))
    const item = screen.getByText('Changes saved').parentElement!.parentElement!
    fireEvent.mouseEnter(item)
    act(() => vi.advanceTimersByTime(5000))
    expect(screen.getByText('Changes saved')).toBeInTheDocument()
    fireEvent.focus(screen.getByRole('button', { name: 'Close' }))
    fireEvent.mouseLeave(item)
    act(() => vi.advanceTimersByTime(5000))
    expect(screen.getByText('Changes saved')).toBeInTheDocument()
    fireEvent.blur(screen.getByRole('button', { name: 'Close' }))
    const hidden = vi.spyOn(document, 'hidden', 'get').mockReturnValue(true)
    fireEvent(document, new Event('visibilitychange'))
    act(() => vi.advanceTimersByTime(5000))
    expect(screen.getByText('Changes saved')).toBeInTheDocument()
    hidden.mockReturnValue(false)
    fireEvent(document, new Event('visibilitychange'))
    act(() => vi.advanceTimersByTime(1999))
    expect(screen.getByText('Changes saved')).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(1))
    expect(screen.queryByText('Changes saved')).not.toBeInTheDocument()
    hidden.mockRestore()
  })
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('pushes a toast notification and auto-dismisses after duration', () => {
    render(
      <ToastProvider>
        <ToastTriggerButton />
      </ToastProvider>,
    )

    expect(screen.queryByText('Changes saved')).not.toBeInTheDocument()

    // Trigger toast
    const button = screen.getByRole('button', { name: 'Show toast' })
    fireEvent.click(button)

    expect(screen.getByText('Changes saved')).toBeInTheDocument()
    expect(screen.getByText('Your project has been updated.')).toBeInTheDocument()

    // Fast-forward past duration
    act(() => {
      vi.advanceTimersByTime(3500)
    })

    expect(screen.queryByText('Changes saved')).not.toBeInTheDocument()
  })

  it('allows manual dismissal of toasts', () => {
    render(
      <ToastProvider>
        <ToastTriggerButton />
      </ToastProvider>,
    )

    const button = screen.getByRole('button', { name: 'Show toast' })
    fireEvent.click(button)

    expect(screen.getByText('Changes saved')).toBeInTheDocument()

    const closeBtn = screen.getByRole('button', { name: 'Close' })
    fireEvent.click(closeBtn)

    expect(screen.queryByText('Changes saved')).not.toBeInTheDocument()
  })

  it('throws error when useToast is called outside ToastProvider', () => {
    expectProviderError(
      () => render(<ToastTriggerButton />),
      'useToast must be used within a <ToastProvider>',
      'ToastTriggerButton',
    )
  })
})
