import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Input } from './Input'
import { FormField } from './FormField'

describe('Input', () => {
  it('renders input and receives user input', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<Input placeholder="Search..." onChange={handleChange} />)

    const input = screen.getByPlaceholderText('Search...')
    await user.type(input, 'Bauhaus')

    expect(input).toHaveValue('Bauhaus')
    expect(handleChange).toHaveBeenCalled()
  })

  it('renders left and right icon adornments', () => {
    render(
      <Input
        placeholder="Icon input"
        leftIcon={<span data-testid="left-icon">🔍</span>}
        rightIcon={<span data-testid="right-icon">✕</span>}
      />,
    )

    expect(screen.getByTestId('left-icon')).toBeInTheDocument()
    expect(screen.getByTestId('right-icon')).toBeInTheDocument()
  })

  it('applies red border when error prop is true', () => {
    render(<Input placeholder="Error input" error />)

    const input = screen.getByPlaceholderText('Error input')
    expect(input).toHaveClass('bui-border-bred')
  })

  it('applies red border automatically when wrapped in invalid FormField', () => {
    render(
      <FormField label="Email" htmlFor="email-input" error="Invalid address">
        <Input id="email-input" placeholder="user@example.com" />
      </FormField>,
    )

    const input = screen.getByPlaceholderText('user@example.com')
    expect(input).toHaveClass('bui-border-bred')
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })
})
