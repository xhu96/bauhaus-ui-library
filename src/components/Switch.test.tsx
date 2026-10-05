import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Switch } from './Switch'
import { FormField } from './FormField'

describe('Switch', () => {
  it('toggles on click and triggers onCheckedChange', async () => {
    const user = userEvent.setup()
    const handleCheckedChange = vi.fn()
    render(<Switch aria-label="Notifications" onCheckedChange={handleCheckedChange} />)

    const toggle = screen.getByRole('switch', { name: 'Notifications' })
    expect(toggle).not.toBeChecked()

    await user.click(toggle)
    expect(toggle).toBeChecked()
    expect(handleCheckedChange).toHaveBeenCalledWith(true)

    await user.click(toggle)
    expect(toggle).not.toBeChecked()
    expect(handleCheckedChange).toHaveBeenCalledWith(false)
  })

  it('toggles using Space and Enter keys', async () => {
    const user = userEvent.setup()
    render(<Switch aria-label="Dark mode" />)

    const toggle = screen.getByRole('switch', { name: 'Dark mode' })
    toggle.focus()

    await user.keyboard(' ')
    expect(toggle).toBeChecked()

    await user.keyboard('{Enter}')
    expect(toggle).not.toBeChecked()
  })

  it('respects disabled state', async () => {
    const user = userEvent.setup()
    const handleCheckedChange = vi.fn()
    render(<Switch disabled aria-label="Disabled switch" onCheckedChange={handleCheckedChange} />)

    const toggle = screen.getByRole('switch', { name: 'Disabled switch' })
    expect(toggle).toBeDisabled()

    await user.click(toggle)
    expect(handleCheckedChange).not.toHaveBeenCalled()
  })

  it('inherits FormField error and required semantics', () => {
    render(
      <FormField label="Enable feature" error="Must be enabled" required>
        <Switch aria-label="Feature flag" />
      </FormField>,
    )

    const toggle = screen.getByRole('switch', { name: 'Feature flag' })
    expect(toggle).toHaveAttribute('aria-invalid', 'true')
    expect(toggle).toHaveAttribute('aria-required', 'true')
    expect(toggle).toHaveAttribute('aria-describedby')
  })
})
