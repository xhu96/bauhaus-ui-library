import type { Meta, StoryObj } from '@storybook/react'
import { fn, within, userEvent, expect } from '@storybook/test'
import { useState } from 'react'
import { Checkbox } from './Checkbox'

const meta = {
  title: 'Form/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    color: { control: 'select', options: ['red', 'blue', 'yellow', 'ink'] },
    label: { control: 'text' },
    disabled: { control: 'boolean' },
    defaultChecked: { control: 'boolean' },
    checked: { control: 'boolean' },
  },
  args: {
    label: 'Accept terms',
    color: 'ink',
    disabled: false,
    onChange: fn(),
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Checked: Story = {
  args: { defaultChecked: true },
}

export const Blue: Story = {
  args: { color: 'blue', defaultChecked: true, label: 'Subscribe' },
}

export const Disabled: Story = {
  args: { disabled: true, defaultChecked: true },
}

export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Checkbox color="red" label="Red" defaultChecked />
      <Checkbox color="blue" label="Blue" defaultChecked />
      <Checkbox color="yellow" label="Yellow" defaultChecked />
      <Checkbox color="ink" label="Ink" defaultChecked />
    </div>
  ),
}

/** No `label`: the text span is omitted entirely, exercising the icon-only render path. */
export const NoLabel: Story = {
  args: { label: undefined, 'aria-label': 'Standalone checkbox' },
}

/** Surfaces the deliberate `peer-focus-visible` outline by focusing the input on mount. */
export const FocusVisible: Story = {
  args: { label: 'Tab to focus me' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('checkbox')
    await userEvent.click(input)
    await expect(input).toBeChecked()
  },
}

/** Controlled usage: state lives in the consumer and is driven via `checked` + `onChange`. */
export const Controlled: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false)
    return (
      <Checkbox
        {...args}
        checked={checked}
        onChange={(e) => {
          setChecked(e.target.checked)
          args.onChange?.(e)
        }}
        label={`Controlled (${checked ? 'on' : 'off'})`}
      />
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = await canvas.findByRole('checkbox')
    await expect(input).not.toBeChecked()
    await userEvent.click(input)
    await expect(input).toBeChecked()
    await expect(await canvas.findByText('Controlled (on)')).toBeVisible()
  },
}

/** Common real-world layout: a group of related checkboxes sharing a `name`, in a fieldset. */
export const CheckboxGroup: Story = {
  render: () => (
    <fieldset className="flex flex-col gap-3 border-3 border-ink bg-surface p-4">
      <legend className="px-2 font-sans text-base text-ink">Toppings</legend>
      <Checkbox name="toppings" id="t-cheese" value="cheese" label="Cheese" defaultChecked />
      <Checkbox name="toppings" id="t-mushroom" value="mushroom" label="Mushroom" />
      <Checkbox name="toppings" id="t-olives" value="olives" label="Olives" color="red" />
    </fieldset>
  ),
}
