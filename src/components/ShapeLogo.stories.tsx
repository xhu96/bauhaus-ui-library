import type { Meta, StoryObj } from '@storybook/react'
import { ShapeLogo } from './ShapeLogo'

const meta = {
  title: 'Foundations/ShapeLogo',
  component: ShapeLogo,
  tags: ['autodocs'],
  args: {
    size: 28,
  },
} satisfies Meta<typeof ShapeLogo>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithWordmark: Story = {
  args: {
    label: 'Bauhaus',
    size: 26,
  },
}

export const CustomMark: Story = {
  args: {
    label: 'Studio',
    size: 26,
    shapes: [
      { kind: 'triangle', color: 'red' },
      { kind: 'ring', color: 'blue' },
      { kind: 'diamond', color: 'yellow' },
    ],
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <ShapeLogo label="Small" size={18} />
      <ShapeLogo label="Medium" size={26} />
      <ShapeLogo label="Large" size={36} />
    </div>
  ),
}
