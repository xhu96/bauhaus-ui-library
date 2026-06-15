import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FormField } from './FormField'
import { Input } from './Input'
import { Select } from './Select'
import { Slider } from './Slider'
import { Textarea } from './Textarea'

describe('FormField', () => {
  it('associates an error with its input and marks it invalid', () => {
    render(
      <FormField label="Password" htmlFor="password" error="Use at least eight characters.">
        <Input id="password" />
      </FormField>,
    )
    const input = screen.getByLabelText('Password')
    const error = screen.getByText('Use at least eight characters.')
    expect(input).toHaveAttribute('aria-describedby', error.id)
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  it('merges caller-provided descriptions with the generated hint id', () => {
    render(
      <>
        <p id="external-help">External help</p>
        <FormField label="Email" htmlFor="email" hint="We do not share your email.">
          <Input id="email" aria-describedby="external-help" />
        </FormField>
      </>,
    )
    const input = screen.getByLabelText('Email')
    const hint = screen.getByText('We do not share your email.')
    expect(input.getAttribute('aria-describedby')?.split(' ')).toEqual(['external-help', hint.id])
  })

  it('passes required and hint semantics to a slider', () => {
    render(
      <FormField label="Opacity" htmlFor="opacity" hint="Choose a value." required>
        <Slider id="opacity" min={0} max={100} />
      </FormField>,
    )
    const slider = screen.getByRole('slider', { name: 'Opacity' })
    const hint = screen.getByText('Choose a value.')
    expect(slider).toHaveAttribute('aria-required', 'true')
    expect(slider).toHaveAttribute('aria-describedby', hint.id)
  })

  it('passes error and required semantics to textareas and selects', () => {
    render(
      <>
        <FormField label="Message" htmlFor="message" error="Message is required." required>
          <Textarea id="message" />
        </FormField>
        <FormField label="Color" htmlFor="color" error="Choose a color." required>
          <Select id="color">
            <option value="">Choose</option>
          </Select>
        </FormField>
      </>,
    )

    for (const control of [
      screen.getByRole('textbox', { name: 'Message' }),
      screen.getByRole('combobox', { name: 'Color' }),
    ]) {
      expect(control).toHaveAttribute('aria-invalid', 'true')
      expect(control).toHaveAttribute('aria-required', 'true')
      expect(control).toHaveAttribute('aria-describedby')
    }
  })

  it('preserves explicit invalid and required aria values', () => {
    render(
      <>
        <FormField label="Name" htmlFor="name" error="Name is required." required>
          <Input id="name" aria-invalid="false" aria-required="false" />
        </FormField>
        <FormField label="Volume" htmlFor="volume" error="Volume is required." required>
          <Slider id="volume" aria-invalid="false" aria-required="false" />
        </FormField>
      </>,
    )

    for (const control of [
      screen.getByRole('textbox', { name: 'Name' }),
      screen.getByRole('slider', { name: 'Volume' }),
    ]) {
      expect(control).toHaveAttribute('aria-invalid', 'false')
      expect(control).toHaveAttribute('aria-required', 'false')
    }
  })
})
