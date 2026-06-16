import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { ShapeLogo } from './ShapeLogo'

const meta = {
  title: 'Foundations/ShapeLogo',
  component: ShapeLogo,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    size: { control: { type: 'range', min: 12, max: 64, step: 1 } },
    shapes: { control: 'object' },
  },
  args: {
    size: 28,
    onClick: fn(),
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

// Gap: triangle optical-kerning (KERN '-ml-1') only applies when a triangle is
// NOT the first shape (i > 0). Placing a triangle after a leading shape exercises
// that branch, which the other stories never do.
export const TriangleKerning: Story = {
  args: {
    label: 'Kern',
    size: 30,
    shapes: [
      { kind: 'square', color: 'ink' },
      { kind: 'triangle', color: 'red' },
      { kind: 'triangle', color: 'blue' },
    ],
  },
}

// Gap: ...props spread onto the div (onClick) makes a clickable / nav logo.
// Click logs to the Actions panel via the meta-level fn().
export const Clickable: Story = {
  args: {
    label: 'Click Me',
    size: 28,
    role: 'button',
    tabIndex: 0,
    className: 'cursor-pointer',
  },
}

// Gap: className is merged via cn(), letting consumers control layout.
export const CustomClassName: Story = {
  args: {
    label: 'Custom',
    size: 26,
    className: 'gap-6 rounded-md border-2 border-ink bg-surface p-4',
  },
}
