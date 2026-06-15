import type { Meta, StoryObj } from '@storybook/react'
import { Spinner } from './Spinner'

const meta = {
  title: 'Display/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  args: {
    size: 'md',
    color: 'ink',
  },
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Colors: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Spinner color="red" size={40} />
      <Spinner color="blue" size={40} />
      <Spinner color="yellow" size={40} />
      <Spinner color="ink" size={40} />
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Spinner size="sm" color="blue" />
      <Spinner size="md" color="blue" />
      <Spinner size="lg" color="blue" />
    </div>
  ),
}
