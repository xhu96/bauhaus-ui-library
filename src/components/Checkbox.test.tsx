import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Checkbox } from './Checkbox'
import { FormField } from './FormField'

describe('Checkbox', () => {
  it('renders label and toggles checked state', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<Checkbox label="I agree to terms" onChange={handleChange} />)

    const checkbox = screen.getByRole('checkbox', { name: 'I agree to terms' })
    expect(checkbox).not.toBeChecked()

    await user.click(checkbox)
    expect(checkbox).toBeChecked()
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('respects disabled state', async () => {
    const user = userEvent.setup()
    render(<Checkbox label="Disabled option" disabled />)

    const checkbox = screen.getByRole('checkbox', { name: 'Disabled option' })
    expect(checkbox).toBeDisabled()

    await user.click(checkbox)
    expect(checkbox).not.toBeChecked()
  })

  it('inherits error and required semantics when wrapped in FormField', () => {
    render(
      <FormField label="Acceptance" error="Must be checked" required>
        <Checkbox />
      </FormField>,
    )

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAttribute('aria-invalid', 'true')
    expect(checkbox).toHaveAttribute('aria-required', 'true')
    expect(checkbox).toHaveAttribute('aria-describedby')
  })
})
