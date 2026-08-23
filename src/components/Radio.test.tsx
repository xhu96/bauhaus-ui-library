import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Radio, RadioGroup } from './Radio'
import { FormField } from './FormField'

describe('Radio and RadioGroup', () => {
  it('manages selection in uncontrolled mode', async () => {
    const user = userEvent.setup()
    const handleValueChange = vi.fn()
    render(
      <RadioGroup defaultValue="circle" onValueChange={handleValueChange}>
        <Radio value="circle" label="Circle" />
        <Radio value="square" label="Square" />
        <Radio value="triangle" label="Triangle" />
      </RadioGroup>,
    )

    const circleRadio = screen.getByRole('radio', { name: 'Circle' })
    const squareRadio = screen.getByRole('radio', { name: 'Square' })

    expect(circleRadio).toBeChecked()
    expect(squareRadio).not.toBeChecked()

    await user.click(squareRadio)
    expect(squareRadio).toBeChecked()
    expect(circleRadio).not.toBeChecked()
    expect(handleValueChange).toHaveBeenCalledWith('square')
  })

  it('supports controlled value', () => {
    render(
      <RadioGroup value="triangle">
        <Radio value="circle" label="Circle" />
        <Radio value="triangle" label="Triangle" />
      </RadioGroup>,
    )

    expect(screen.getByRole('radio', { name: 'Triangle' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Circle' })).not.toBeChecked()
  })

  it('throws error when Radio is used outside RadioGroup', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => {
      render(<Radio value="standalone" label="Standalone" />)
    }).toThrow('Radio must be used within a RadioGroup')
    consoleError.mockRestore()
  })

  it('automatically associates with FormField label and inherits semantics', () => {
    render(
      <FormField label="Shape Selection" error="Please select a shape" required>
        <RadioGroup>
          <Radio value="circle" label="Circle" />
          <Radio value="square" label="Square" />
        </RadioGroup>
      </FormField>,
    )

    // Automatically named by FormField's label without explicit aria-label!
    const group = screen.getByRole('radiogroup', { name: 'Shape Selection' })
    expect(group).toHaveAttribute('aria-invalid', 'true')
    expect(group).toHaveAttribute('aria-required', 'true')
    expect(group).toHaveAttribute('aria-describedby')
  })
})
