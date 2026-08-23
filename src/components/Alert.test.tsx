import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Alert } from './Alert'

describe('Alert', () => {
  it('renders with default info status, title and content', () => {
    render(<Alert title="System Notice">Maintenance scheduled tonight.</Alert>)

    const alert = screen.getByRole('alert')
    expect(alert).toBeInTheDocument()
    expect(screen.getByText('System Notice')).toBeInTheDocument()
    expect(screen.getByText('Maintenance scheduled tonight.')).toBeInTheDocument()
  })

  it('renders dismiss button and triggers onClose callback', async () => {
    const user = userEvent.setup()
    const handleClose = vi.fn()
    render(
      <Alert status="danger" title="Error" onClose={handleClose}>
        An unexpected error occurred.
      </Alert>,
    )

    const dismissBtn = screen.getByRole('button', { name: /dismiss/i })
    expect(dismissBtn).toBeInTheDocument()

    await user.click(dismissBtn)
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('renders custom icon when provided', () => {
    render(
      <Alert title="Custom" icon={<span data-testid="custom-icon">🔥</span>}>
        Hot alert!
      </Alert>,
    )

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
  })
})
