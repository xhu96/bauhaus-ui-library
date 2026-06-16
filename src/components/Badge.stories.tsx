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
  argTypes: {
    variant: { control: 'select', options: ['solid', 'outline'] },
    color: { control: 'select', options: ['red', 'blue', 'yellow', 'ink'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
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

export const OutlineColors: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge variant="outline" color="ink">
        Ink
      </Badge>
      <Badge variant="outline" color="red">
        Red
      </Badge>
      <Badge variant="outline" color="blue">
        Blue
      </Badge>
      <Badge variant="outline" color="yellow">
        Yellow
      </Badge>
    </div>
  ),
}
