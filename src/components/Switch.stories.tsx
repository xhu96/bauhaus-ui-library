import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Switch } from './Switch'

const meta = {
  title: 'Form/Switch',
  component: Switch,
  tags: ['autodocs'],
  args: {
    color: 'blue',
    size: 'md',
    disabled: false,
  },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

function SwitchDemo() {
  const [on, setOn] = useState(false)
  return <Switch checked={on} onCheckedChange={setOn} aria-label="Toggle setting" />
}

export const Default: Story = {
  render: () => <SwitchDemo />,
}

export const On: Story = {
  args: { defaultChecked: true, 'aria-label': 'Enabled' },
}

export const Disabled: Story = {
  args: { disabled: true, defaultChecked: true, 'aria-label': 'Disabled' },
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
