import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './Badge'

const meta = {
  title: 'Display/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: {
    children: 'New',
    variant: 'solid',
    color: 'ink',
    size: 'md',
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Colors: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge color="ink">Ink</Badge>
      <Badge color="red">Red</Badge>
      <Badge color="blue">Blue</Badge>
      <Badge color="yellow">Yellow</Badge>
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge variant="solid" color="blue">
        Solid
      </Badge>
      <Badge variant="outline" color="blue">
        Outline
      </Badge>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
}
