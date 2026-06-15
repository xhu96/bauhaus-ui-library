import type { Meta, StoryObj } from '@storybook/react'
import { Divider } from './Divider'

const meta = {
  title: 'Display/Divider',
  component: Divider,
  tags: ['autodocs'],
  args: {
    orientation: 'horizontal',
    variant: 'solid',
    color: 'ink',
  },
} satisfies Meta<typeof Divider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className="w-96">
      <Divider {...args} />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-6">
      <Divider variant="solid" />
      <Divider variant="dashed" />
      <Divider variant="dotted" />
    </div>
  ),
}

export const Colors: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-6">
      <Divider color="red" thickness={4} />
      <Divider color="blue" thickness={4} />
      <Divider color="yellow" thickness={4} />
      <Divider color="ink" thickness={4} />
    </div>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <div className="w-96">
      <Divider label="Or" color="ink" />
    </div>
  ),
}

export const Vertical: Story = {
  render: () => (
    <div className="flex h-16 items-stretch gap-4">
      <span className="self-center font-display font-bold text-ink">Left</span>
      <Divider orientation="vertical" thickness={4} color="red" />
      <span className="self-center font-display font-bold text-ink">Middle</span>
      <Divider orientation="vertical" thickness={4} color="blue" />
      <span className="self-center font-display font-bold text-ink">Right</span>
    </div>
  ),
}
