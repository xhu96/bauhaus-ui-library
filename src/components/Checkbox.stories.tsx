import type { Meta, StoryObj } from '@storybook/react'
import { Checkbox } from './Checkbox'

const meta = {
  title: 'Form/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: {
    label: 'Accept terms',
    color: 'ink',
    disabled: false,
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
