import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Textarea } from './Textarea'
import { FormField } from './FormField'

describe('Textarea', () => {
  it('renders textarea and accepts multiline input', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<Textarea placeholder="Enter notes..." onChange={handleChange} />)

    const textarea = screen.getByPlaceholderText('Enter notes...')
    await user.type(textarea, 'Line 1{enter}Line 2')

    expect(textarea).toHaveValue('Line 1\nLine 2')
    expect(handleChange).toHaveBeenCalled()
  })

  it('applies red error border when inside invalid FormField', () => {
    render(
      <FormField label="Bio" htmlFor="bio-input" error="Bio is required">
        <Textarea id="bio-input" placeholder="Tell us about yourself" />
      </FormField>,
    )

    const textarea = screen.getByPlaceholderText('Tell us about yourself')
    expect(textarea).toHaveClass('bui-border-bred')
    expect(textarea).toHaveAttribute('aria-invalid', 'true')
  })
})
