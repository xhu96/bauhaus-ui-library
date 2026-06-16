import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { expect, fn, userEvent, within } from '@storybook/test'
import { Switch } from './Switch'

const meta = {
  title: 'Form/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['red', 'blue', 'yellow', 'ink'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    checked: { control: 'boolean' },
    defaultChecked: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    color: 'blue',
    size: 'md',
    disabled: false,
    onCheckedChange: fn(),
    'aria-label': 'Toggle setting',
  },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Controlled: Story = {
  render: (args) => {
    const [on, setOn] = useState(false)
    return (
      <Switch
        {...args}
        checked={on}
        onCheckedChange={(v) => {
          setOn(v)
          args.onCheckedChange?.(v)
        }}
      />
    )
  },
}

export const On: Story = {
  args: { defaultChecked: true, 'aria-label': 'Enabled' },
}

export const Disabled: Story = {
  args: { disabled: true, defaultChecked: true, 'aria-label': 'Disabled' },
}

export const DisabledOff: Story = {
  args: { disabled: true, defaultChecked: false, 'aria-label': 'Disabled off' },
}

export const Colors: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Switch color="red" defaultChecked aria-label="Red" />
      <Switch color="blue" defaultChecked aria-label="Blue" />
      <Switch color="yellow" defaultChecked aria-label="Yellow" />
      <Switch color="ink" defaultChecked aria-label="Ink" />
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Switch size="sm" defaultChecked aria-label="Small" />
      <Switch size="md" defaultChecked aria-label="Medium" />
      <Switch size="lg" defaultChecked aria-label="Large" />
    </div>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <label id="notifications-label" htmlFor="notifications" className="font-bold">
        Enable notifications
      </label>
      <Switch id="notifications" aria-labelledby="notifications-label" />
    </div>
  ),
}

export const TogglesOnClick: Story = {
  args: { 'aria-label': 'Toggle me' },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const sw = await canvas.findByRole('switch')
    await expect(sw).toHaveAttribute('aria-checked', 'false')
    await userEvent.click(sw)
    await expect(sw).toHaveAttribute('aria-checked', 'true')
    await expect(args.onCheckedChange).toHaveBeenCalledWith(true)
  },
}
