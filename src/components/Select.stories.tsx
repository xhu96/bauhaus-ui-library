import type { Meta, StoryObj } from '@storybook/react'
import { within, userEvent, expect, fn } from '@storybook/test'
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
  argTypes: {
    selectSize: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    multiple: { control: 'boolean' },
  },
  args: {
    selectSize: 'md',
    error: false,
    disabled: false,
    options,
    onChange: fn(),
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

export const ControlledValue: Story = {
  args: { defaultValue: 'blue' },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const select = await canvas.findByRole('combobox')
    await expect(select).toHaveValue('blue')
    await userEvent.selectOptions(select, 'yellow')
    await expect(select).toHaveValue('yellow')
    await expect(args.onChange).toHaveBeenCalled()
  },
}

export const Placeholder: Story = {
  args: { options: undefined, defaultValue: '' },
  render: (args) => (
    <Select {...args}>
      <option value="" disabled hidden>
        Select a color…
      </option>
      <option value="red">Red</option>
      <option value="blue">Blue</option>
      <option value="yellow">Yellow</option>
    </Select>
  ),
}

export const AllSizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Select {...args} selectSize="sm" />
      <Select {...args} selectSize="md" />
      <Select {...args} selectSize="lg" />
    </div>
  ),
}

export const Multiple: Story = {
  args: { multiple: true },
}
