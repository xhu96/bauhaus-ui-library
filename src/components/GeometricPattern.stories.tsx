import type { Meta, StoryObj } from '@storybook/react'
import { GeometricPattern } from './GeometricPattern'

const meta = {
  title: 'Foundations/GeometricPattern',
  component: GeometricPattern,
  tags: ['autodocs'],
  args: {
    rows: 4,
    cols: 8,
    seed: 7,
  },
} satisfies Meta<typeof GeometricPattern>

export default meta
type Story = StoryObj<typeof meta>

// Tiles are square and self-sizing: height follows from cols + container width.
export const Default: Story = {
  render: (args) => <GeometricPattern {...args} />,
}

export const Bordered: Story = {
  render: () => <GeometricPattern rows={3} cols={8} bordered />,
}

export const Seeds: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {[1, 7, 42].map((seed) => (
        <GeometricPattern key={seed} rows={2} cols={12} seed={seed} />
      ))}
    </div>
  ),
}

export const CustomPalette: Story = {
  render: () => <GeometricPattern rows={3} cols={6} palette={['red', 'ink']} surfaces={['white', 'yellow']} />,
}
