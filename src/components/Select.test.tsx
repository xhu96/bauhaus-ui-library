import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Select } from './Select'
import { FormField } from './FormField'

describe('Select', () => {
  it('renders options array and handles selection change', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    const options = [
      { label: 'Red', value: 'red' },
      { label: 'Blue', value: 'blue' },
      { label: 'Yellow', value: 'yellow' },
    ]

    render(<Select options={options} defaultValue="blue" onChange={handleChange} />)

    const select = screen.getByRole('combobox')
    expect(select).toHaveValue('blue')

    await user.selectOptions(select, 'yellow')
    expect(select).toHaveValue('yellow')
    expect(handleChange).toHaveBeenCalled()
  })

  it('renders custom children options', () => {
    render(
      <Select defaultValue="light">
        <option value="light">Light theme</option>
        <option value="dark">Dark theme</option>
      </Select>,
    )

    expect(screen.getByRole('combobox')).toHaveValue('light')
    expect(screen.getByText('Dark theme')).toBeInTheDocument()
  })

  it('applies red error border when inside invalid FormField', () => {
    render(
      <FormField label="Palette" htmlFor="palette-select" error="Please select a color">
        <Select id="palette-select" options={[{ label: 'None', value: '' }]} />
      </FormField>,
    )

    const select = screen.getByRole('combobox', { name: 'Palette' })
    expect(select).toHaveClass('bui-border-bred')
    expect(select).toHaveAttribute('aria-invalid', 'true')
  })
})
