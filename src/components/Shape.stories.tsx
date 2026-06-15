import type { Meta, StoryObj } from '@storybook/react'
import { Shape, type ShapeKind } from './Shape'

const ALL_KINDS: ShapeKind[] = [
  'circle',
  'square',
  'triangle',
  'semicircle',
  'quarter',
  'ring',
  'diamond',
  'cross',
  'arc',
]

const meta = {
  title: 'Foundations/Shape',
  component: Shape,
  tags: ['autodocs'],
  args: {
    kind: 'circle',
    color: 'red',
    size: 80,
  },
} satisfies Meta<typeof Shape>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const AllKinds: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      {ALL_KINDS.map((kind) => (
        <Shape key={kind} kind={kind} color="blue" size={64} />
      ))}
    </div>
  ),
}

export const Colors: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Shape kind="square" color="red" size={64} />
      <Shape kind="square" color="blue" size={64} />
      <Shape kind="square" color="yellow" size={64} />
      <Shape kind="square" color="ink" size={64} />
    </div>
  ),
}

export const Outline: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Shape kind="circle" color="red" size={64} outline />
      <Shape kind="square" color="blue" size={64} outline />
      <Shape kind="triangle" color="ink" size={64} outline />
      <Shape kind="diamond" color="yellow" size={64} outline />
    </div>
  ),
}
