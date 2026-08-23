import { render, screen, act, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { ToastProvider, useToast } from './Toast'
import { Button } from './Button'

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
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => {
      render(<ToastTriggerButton />)
    }).toThrow('useToast must be used within a <ToastProvider>')
    consoleError.mockRestore()
  })
})
