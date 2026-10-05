import { createRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { FormField } from './FormField'
import { Input } from './Input'
import { Textarea } from './Textarea'
import { Select } from './Select'
import { Checkbox } from './Checkbox'
import { Switch } from './Switch'
import { Radio, RadioGroup } from './Radio'

describe('native control contracts', () => {
  it('keeps Radio reset synchronized when an onReset handler rerenders its parent', async () => {
    function Form() {
      const [count, setCount] = useState(0)
      return (
        <form aria-label="Reset" onReset={() => flushSync(() => setCount(count + 1))}>
          <button type="button" onClick={() => setCount(count + 1)}>
            Refresh {count}
          </button>
          <RadioGroup defaultValue="a">
            <Radio value="a" label="A" />
            <Radio value="b" label="B" />
          </RadioGroup>
        </form>
      )
    }
    render(<Form />)
    await userEvent.click(screen.getByRole('radio', { name: 'B' }))
    await act(async () => (screen.getByRole('form') as HTMLFormElement).reset())
    await userEvent.click(screen.getByRole('button', { name: /Refresh/ }))
    expect(screen.getByRole('radio', { name: 'A' })).toBeChecked()
    await userEvent.click(screen.getByRole('radio', { name: 'B' }))
    expect(screen.getByRole('radio', { name: 'B' })).toBeChecked()
  })

  it('uses a single child passed as an array for automatic labeling', () => {
    render(<FormField label="Email">{[<Input key="email" id="email" />]}</FormField>)
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAttribute('id', 'email')
  })
  it('uses the immediate child ID for label activation', async () => {
    render(
      <FormField label="Email">
        <Input id="email" />
      </FormField>,
    )
    const input = screen.getByRole('textbox', { name: 'Email' })
    await userEvent.click(screen.getByText('Email'))
    expect(input).toHaveFocus()
    expect(input.id).toBe('email')
  })

  it('names a wrapped control without replacing its explicit ID', () => {
    render(
      <FormField label="Email">
        <div>
          <Input id="wrapped-email" />
        </div>
      </FormField>,
    )
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAttribute('id', 'wrapped-email')
  })

  it('supports explicit htmlFor for arbitrary nested native composition', async () => {
    render(
      <FormField label="Email" htmlFor="nested">
        <div>
          <input id="nested" />
        </div>
      </FormField>,
    )
    await userEvent.click(screen.getByText('Email'))
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveFocus()
  })

  it.each([
    <Input />,
    <Textarea />,
    <Select>
      <option>One</option>
    </Select>,
    <Checkbox />,
    <Switch />,
  ])('lets native required=false override field requirements (%#)', (control) => {
    render(
      <FormField label="Optional" required>
        {/* explicit override on each control */}
        {control.type === Input ? (
          <Input required={false} />
        ) : control.type === Textarea ? (
          <Textarea required={false} />
        ) : control.type === Select ? (
          <Select required={false}>
            <option>One</option>
          </Select>
        ) : control.type === Checkbox ? (
          <Checkbox required={false} />
        ) : (
          <Switch required={false} />
        )}
      </FormField>,
    )
    const input = screen.getByLabelText(/Optional/)
    expect(input).not.toHaveAttribute('required')
    expect(input).not.toHaveAttribute('aria-required', 'true')
  })

  it.each(['input', 'textarea', 'select'] as const)(
    'enhances a direct native %s without losing explicit attributes',
    (Tag) => {
      const change = vi.fn()
      render(
        <>
          <p id="external">External</p>
          <FormField label="Native" hint="Hint" error="Error" required>
            <Tag
              id="native"
              aria-describedby="external"
              required={false}
              aria-invalid={false}
              onChange={change}
            />
          </FormField>
        </>,
      )
      const input = screen.getByLabelText(/Native/)
      expect(input).toHaveAccessibleDescription('External Hint Error')
      expect(input).not.toHaveAttribute('required')
      expect(input).not.toHaveAttribute('aria-required', 'true')
      expect(input).toHaveAttribute('aria-invalid', 'false')
      fireEvent.change(input, { target: { value: 'value' } })
      expect(change).toHaveBeenCalledOnce()
    },
  )

  it('does not assign duplicate IDs to multiple controls', () => {
    const { container } = render(
      <FormField label="Group">
        <Input />
        <Input />
      </FormField>,
    )
    const ids = [...container.querySelectorAll('input[id]')].map((input) => input.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('Switch supports native submission, validation, refs, blur and label activation', async () => {
    const ref = createRef<HTMLInputElement>()
    const change = vi.fn()
    const blur = vi.fn()
    render(
      <form aria-label="Settings">
        <FormField label="Consent" required>
          <Switch ref={ref} name="consent" value="yes" onChange={change} onBlur={blur} />
        </FormField>
        <button>Save</button>
      </form>,
    )
    const form = screen.getByRole('form') as HTMLFormElement
    const input = screen.getByRole('switch', { name: 'Consent' })
    expect(ref.current).toBe(input)
    expect(form.checkValidity()).toBe(false)
    await userEvent.click(screen.getByText('Consent'))
    expect(input).toBeChecked()
    expect(new FormData(form).get('consent')).toBe('yes')
    expect(form.checkValidity()).toBe(true)
    await userEvent.tab()
    expect(change).toHaveBeenCalledOnce()
    expect(blur).toHaveBeenCalledOnce()
  })

  it.each([false, true])('resets Switch state and survives rerender (controlled=%s)', async (controlled) => {
    const change = vi.fn()
    const view = () => (
      <form aria-label="Settings">
        <Switch
          aria-label="Setting"
          checked={controlled ? true : undefined}
          defaultChecked
          onCheckedChange={change}
        />
      </form>
    )
    const { rerender } = render(view())
    if (!controlled) await userEvent.click(screen.getByRole('switch'))
    await act(async () => (screen.getByRole('form') as HTMLFormElement).reset())
    rerender(view())
    expect(screen.getByRole('switch')).toBeChecked()
    expect(screen.getByRole('switch')).not.toHaveAttribute('aria-checked')
    expect(change).toHaveBeenCalledTimes(controlled ? 0 : 1)
  })

  it('respects cancelled resets, disabled fieldsets and prevented Enter on Switch', async () => {
    const { rerender } = render(
      <form aria-label="Settings" onReset={(e) => e.preventDefault()}>
        <Switch aria-label="Setting" defaultChecked onKeyDown={(e) => e.preventDefault()} />
      </form>,
    )
    const input = screen.getByRole('switch')
    await userEvent.click(input)
    await act(async () => (screen.getByRole('form') as HTMLFormElement).reset())
    expect(input).not.toBeChecked()
    await userEvent.keyboard('{Enter}')
    expect(input).not.toBeChecked()
    rerender(
      <fieldset disabled>
        <Switch aria-label="Setting" />
      </fieldset>,
    )
    await userEvent.click(screen.getByRole('switch'))
    fireEvent.keyDown(screen.getByRole('switch'), { key: 'Enter' })
    expect(screen.getByRole('switch')).not.toBeChecked()
  })

  it.each([false, true])(
    'Radio resets to default without notifying selection (controlled=%s)',
    async (controlled) => {
      const change = vi.fn()
      const view = () => (
        <form aria-label="Shapes">
          <RadioGroup
            name="shape"
            defaultValue="a"
            value={controlled ? 'b' : undefined}
            onValueChange={change}
          >
            <Radio value="a" label="A" />
            <Radio value="b" label="B" />
          </RadioGroup>
        </form>
      )
      const { rerender } = render(view())
      if (!controlled) await userEvent.click(screen.getByRole('radio', { name: 'B' }))
      await act(async () => (screen.getByRole('form') as HTMLFormElement).reset())
      rerender(view())
      expect(screen.getByRole('radio', { name: controlled ? 'B' : 'A' })).toBeChecked()
      expect(new FormData(screen.getByRole('form') as HTMLFormElement).get('shape')).toBe(
        controlled ? 'b' : 'a',
      )
      expect(change).toHaveBeenCalledTimes(controlled ? 0 : 1)
    },
  )

  it('Radio preserves cancelled reset state and native input handlers/ref/form', async () => {
    const ref = createRef<HTMLInputElement>()
    const change = vi.fn()
    const blur = vi.fn()
    render(
      <>
        <form id="external-form" aria-label="Shapes" onReset={(e) => e.preventDefault()} />
        <FormField label="Shape" required>
          <RadioGroup required={false} name="shape" defaultValue="a">
            <Radio value="a" label="A" form="external-form" />
            <Radio
              ref={ref}
              id="b"
              value="b"
              label="B"
              form="external-form"
              onChange={change}
              onBlur={blur}
            />
          </RadioGroup>
        </FormField>
      </>,
    )
    const input = screen.getByRole('radio', { name: 'B' })
    expect(ref.current).toBe(input)
    expect(input).not.toHaveAttribute('required')
    expect(screen.getByRole('radiogroup')).not.toHaveAttribute('aria-required', 'true')
    await userEvent.click(input)
    await userEvent.tab()
    expect(change).toHaveBeenCalledOnce()
    expect(blur).toHaveBeenCalledOnce()
    await act(async () => (screen.getByRole('form') as HTMLFormElement).reset())
    expect(input).toBeChecked()
    expect(new FormData(screen.getByRole('form') as HTMLFormElement).get('shape')).toBe('b')
  })

  it('Checkbox and Radio expose the compiled peer selector contract', () => {
    render(
      <>
        <Checkbox aria-label="Check" />
        <RadioGroup>
          <Radio value="a" label="Radio" />
        </RadioGroup>
      </>,
    )
    for (const control of [screen.getByRole('checkbox'), screen.getByRole('radio')]) {
      expect(control).toHaveClass('bui-peer')
      expect(control.nextElementSibling).toHaveClass('peer-focus-visible:bui-outline-[3px]')
    }
  })

  it('keeps an uncontrolled Switch native when its ref is updated by a form library', () => {
    const ref = createRef<HTMLInputElement>()
    const { rerender } = render(<Switch ref={ref} aria-label="Native" />)
    ref.current!.checked = true
    rerender(<Switch ref={ref} aria-label="Native" />)
    expect(screen.getByRole('switch')).toBeChecked()
    expect(screen.getByRole('switch')).not.toHaveAttribute('aria-checked')
  })
})
