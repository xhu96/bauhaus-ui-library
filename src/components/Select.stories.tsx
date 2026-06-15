import type { Meta, StoryObj } from '@storybook/react'
import { Select } from './Select'

const options = [
  { label: 'Red', value: 'red' },
  { label: 'Blue', value: 'blue' },
  { label: 'Yellow', value: 'yellow' },
]

const meta = {
  title: 'Form/Select',
  component: Select,
  tags: ['autodocs'],
  args: {
    selectSize: 'md',
    error: false,
    disabled: false,
    options,
  },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Small: Story = {
  args: { selectSize: 'sm' },
}

export const Large: Story = {
  args: { selectSize: 'lg' },
}

export const Error: Story = {
  args: { error: true },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const WithChildren: Story = {
  args: { options: undefined },
  render: (args) => (
    <Select {...args}>
      <option value="a">Option A</option>
      <option value="b">Option B</option>
      <option value="c">Option C</option>
    </Select>
  ),
}
