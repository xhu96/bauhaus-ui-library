import type { Meta, StoryObj } from '@storybook/react'
import { Progress } from './Progress'

const meta = {
  title: 'Display/Progress',
  component: Progress,
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    color: { control: 'select', options: ['red', 'blue', 'yellow', 'ink'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    showLabel: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
  },
  args: {
    value: 60,
    color: 'red',
    size: 'md',
  },
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  decorators: [
    (StoryFn) => (
      <div className="w-96">
        <StoryFn />
      </div>
    ),
  ],
}

export const WithLabel: Story = {
  render: () => (
    <div className="w-96">
      <Progress value={72} showLabel color="blue" />
    </div>
  ),
}

export const Colors: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-4">
      <Progress value={40} color="red" />
      <Progress value={60} color="blue" />
      <Progress value={80} color="yellow" />
      <Progress value={100} color="ink" />
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-4">
      <Progress value={60} size="sm" color="blue" />
      <Progress value={60} size="md" color="blue" />
      <Progress value={60} size="lg" color="blue" />
    </div>
  ),
}

export const Indeterminate: Story = {
  render: () => (
    <div className="w-96">
      <Progress indeterminate color="blue" />
    </div>
  ),
}

export const Empty: Story = {
  render: () => (
    <div className="w-96">
      <Progress value={0} showLabel color="blue" />
    </div>
  ),
}

export const Clamped: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-4">
      <Progress value={150} showLabel color="red" />
      <Progress value={-20} showLabel color="ink" />
    </div>
  ),
}

export const LabelWithSizes: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-4">
      <Progress value={100} showLabel size="sm" color="blue" />
      <Progress value={100} showLabel size="md" color="blue" />
      <Progress value={100} showLabel size="lg" color="blue" />
    </div>
  ),
}

export const LabelSuppressedWhenIndeterminate: Story = {
  render: () => (
    <div className="w-96">
      <Progress indeterminate showLabel color="yellow" />
    </div>
  ),
}
