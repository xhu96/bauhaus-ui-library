import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FormField } from './FormField'
import { Input } from './Input'
import { Select } from './Select'
import { Slider } from './Slider'
import { Textarea } from './Textarea'
import { Checkbox } from './Checkbox'

describe('FormField', () => {
  it('generates a control id and propagates native required semantics', () => {
    render(
      <FormField label="Email" required>
        <Input />
      </FormField>,
    )

    const input = screen.getByRole('textbox', { name: 'Email' })
    const label = screen.getByText('Email').closest('label')

    expect(input.id).not.toBe('')
    expect(label).toHaveAttribute('for', input.id)
    expect(input).toBeRequired()
    expect(input).toHaveAttribute('aria-required', 'true')
  })

  it('keeps hint and error visible and references both descriptions', () => {
    render(
      <FormField label="Password" hint="Use at least eight characters." error="Password is too short.">
        <Input />
      </FormField>,
    )

    const input = screen.getByRole('textbox', { name: 'Password' })
    const hint = screen.getByText('Use at least eight characters.')
    const error = screen.getByText('Password is too short.')

    expect(input.getAttribute('aria-describedby')?.split(' ')).toEqual([hint.id, error.id])
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

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

  it('describes a slider without deriving required semantics', () => {
    render(
      <FormField label="Opacity" htmlFor="opacity" hint="Choose a value." required>
        <Slider id="opacity" min={0} max={100} />
      </FormField>,
    )
    const slider = screen.getByRole('slider', { name: 'Opacity' })
    const hint = screen.getByText('Choose a value.')
    expect(slider).not.toHaveAttribute('aria-required')
    expect(slider).toHaveAttribute('aria-describedby', hint.id)
  })

  it('does not derive required semantics for an input with type range', () => {
    render(
      <FormField label="Brightness" htmlFor="brightness" required>
        <Input id="brightness" type="range" />
      </FormField>,
    )

    expect(screen.getByRole('slider', { name: 'Brightness' })).not.toHaveAttribute('aria-required')
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

    const textarea = screen.getByRole('textbox', { name: 'Message' })
    const textareaError = screen.getByText('Message is required.')
    expect(textarea).toHaveAttribute('aria-invalid', 'true')
    expect(textarea).toHaveAttribute('aria-required', 'true')
    expect(textarea).toBeRequired()
    expect(textarea).toHaveAttribute('aria-describedby', textareaError.id)

    const select = screen.getByRole('combobox', { name: 'Color' })
    const selectError = screen.getByText('Choose a color.')
    expect(select).toHaveAttribute('aria-invalid', 'true')
    expect(select).toHaveAttribute('aria-required', 'true')
    expect(select).toBeRequired()
    expect(select).toHaveAttribute('aria-describedby', selectError.id)
  })

  it('propagates generated ids and native required semantics to checkbox controls', () => {
    const { rerender } = render(
      <FormField label="Terms" required>
        <Checkbox />
      </FormField>,
    )

    const checkbox = screen.getByRole('checkbox', { name: 'Terms' })
    expect(checkbox.id).not.toBe('')
    expect(checkbox).toBeRequired()

    rerender(
      <FormField label="Message" required>
        <Textarea />
      </FormField>,
    )

    expect(screen.getByRole('textbox', { name: 'Message' })).toBeRequired()
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

  it('preserves explicit required aria values on range controls', () => {
    render(
      <>
        <FormField label="Zoom" htmlFor="zoom">
          <Input id="zoom" type="range" aria-required="true" />
        </FormField>
        <FormField label="Volume" htmlFor="explicit-volume">
          <Slider id="explicit-volume" aria-required="true" />
        </FormField>
      </>,
    )

    expect(screen.getByRole('slider', { name: 'Zoom' })).toHaveAttribute('aria-required', 'true')
    expect(screen.getByRole('slider', { name: 'Volume' })).toHaveAttribute('aria-required', 'true')
  })
})
