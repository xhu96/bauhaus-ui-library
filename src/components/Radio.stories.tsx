import type { Meta, StoryObj } from '@storybook/react'
import { fn, within, userEvent, expect } from '@storybook/test'
import { useState } from 'react'
import { RadioGroup, Radio } from './Radio'

const meta = {
  title: 'Form/Radio',
  component: RadioGroup,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal'],
    },
    value: { control: 'text' },
    defaultValue: { control: 'text' },
    name: { control: 'text' },
    onValueChange: { action: 'valueChanged' },
  },
  args: {
    children: null,
    onValueChange: fn(),
  },
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

function RadioDemo() {
  const [value, setValue] = useState('blue')
  return (
    <RadioGroup value={value} onValueChange={setValue}>
      <Radio value="red" label="Red" color="red" />
      <Radio value="blue" label="Blue" color="blue" />
      <Radio value="yellow" label="Yellow" color="yellow" />
    </RadioGroup>
  )
}

export const Default: Story = {
  render: () => <RadioDemo />,
}

export const Horizontal: Story = {
  render: () => (
    <RadioGroup defaultValue="a" orientation="horizontal">
      <Radio value="a" label="First" />
      <Radio value="b" label="Second" />
      <Radio value="c" label="Third" />
    </RadioGroup>
  ),
}

export const WithDisabled: Story = {
  render: () => (
    <RadioGroup defaultValue="a">
      <Radio value="a" label="Available" />
      <Radio value="b" label="Disabled" disabled />
    </RadioGroup>
  ),
}

/** All four palette colors, including the default `ink`. */
export const AllColors: Story = {
  render: () => (
    <RadioGroup defaultValue="ink">
      <Radio value="ink" label="Ink (default)" />
      <Radio value="red" label="Red" color="red" />
      <Radio value="blue" label="Blue" color="blue" />
      <Radio value="yellow" label="Yellow" color="yellow" />
    </RadioGroup>
  ),
}

/** A disabled option that is also the currently selected one. */
export const DisabledChecked: Story = {
  render: () => (
    <RadioGroup defaultValue="a">
      <Radio value="a" label="Selected & disabled" disabled />
      <Radio value="b" label="Enabled" />
    </RadioGroup>
  ),
}

/** Uncontrolled with no default value: every option starts unselected. */
export const Unselected: Story = {
  render: () => (
    <RadioGroup>
      <Radio value="a" label="First" />
      <Radio value="b" label="Second" />
      <Radio value="c" label="Third" />
    </RadioGroup>
  ),
}

/** Bare circular controls with no labels. */
export const WithoutLabel: Story = {
  render: () => (
    <RadioGroup defaultValue="a" orientation="horizontal">
      <Radio value="a" />
      <Radio value="b" color="red" />
      <Radio value="c" color="blue" />
    </RadioGroup>
  ),
}

/**
 * Selecting an option fires `onValueChange`, moves the checked state, and
 * keyboard focus reveals the focus ring on the active control.
 */
export const SelectInteraction: Story = {
  args: {
    defaultValue: 'a',
    children: null,
  },
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="a" label="First" />
      <Radio value="b" label="Second" />
      <Radio value="c" label="Third" />
    </RadioGroup>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const first = await canvas.findByRole('radio', { name: 'First' })
    const second = await canvas.findByRole('radio', { name: 'Second' })

    expect(first).toBeChecked()
    expect(second).not.toBeChecked()

    await userEvent.click(second)

    expect(second).toBeChecked()
    expect(first).not.toBeChecked()
    expect(args.onValueChange).toHaveBeenCalledWith('b')
    expect(second).toHaveFocus()
  },
}
