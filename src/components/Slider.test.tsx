import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Slider } from './Slider'
import { FormField } from './FormField'

describe('Slider', () => {
  it('renders range input and handles value change', () => {
    const handleChange = vi.fn()
    render(<Slider min={0} max={100} defaultValue={50} aria-label="Volume" onChange={handleChange} />)

    const slider = screen.getByRole('slider', { name: 'Volume' })
    expect(slider).toHaveValue('50')

    fireEvent.change(slider, { target: { value: '75' } })
    expect(handleChange).toHaveBeenCalled()
    expect(slider).toHaveValue('75')
  })

  it('applies custom accent color style', () => {
    render(<Slider color="blue" aria-label="Blue slider" />)

    const slider = screen.getByRole('slider', { name: 'Blue slider' })
    expect(slider).toHaveStyle({ accentColor: '#21409A' })
  })

  it('respects disabled state', () => {
    render(<Slider disabled aria-label="Disabled slider" />)

    const slider = screen.getByRole('slider', { name: 'Disabled slider' })
    expect(slider).toBeDisabled()
  })

  it('inherits FormField error semantics', () => {
    render(
      <FormField label="Brightness" error="Must adjust brightness">
        <Slider aria-label="Brightness control" />
      </FormField>,
    )

    const slider = screen.getByRole('slider', { name: 'Brightness control' })
    expect(slider).toHaveAttribute('aria-invalid', 'true')
    expect(slider).toHaveAttribute('aria-describedby')
  })
})
