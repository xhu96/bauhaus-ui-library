import type { Meta, StoryObj } from '@storybook/react'
import { GeometricPattern } from './GeometricPattern'

const COLOR_OPTIONS = ['red', 'blue', 'yellow', 'ink', 'paper', 'white'] as const

const meta = {
  title: 'Foundations/GeometricPattern',
  component: GeometricPattern,
  tags: ['autodocs'],
  args: {
    rows: 4,
    cols: 8,
    seed: 7,
  },
  argTypes: {
    rows: { control: { type: 'range', min: 1, max: 16, step: 1 } },
    cols: { control: { type: 'range', min: 1, max: 24, step: 1 } },
    seed: { control: { type: 'number' } },
    bordered: { control: 'boolean' },
    palette: {
      control: 'check',
      options: COLOR_OPTIONS,
      description: 'Shape colors drawn on each tile.',
    },
    surfaces: {
      control: 'check',
      options: COLOR_OPTIONS,
      description: 'Tile background colors.',
    },
  },
} satisfies Meta<typeof GeometricPattern>

export default meta
type Story = StoryObj<typeof meta>

// Args-driven so the Controls panel actually drives the component.
// Tiles are square and self-sizing: height follows from cols + container width.
export const Default: Story = {}

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
  render: () => (
    <GeometricPattern rows={3} cols={6} palette={['red', 'ink']} surfaces={['white', 'yellow']} />
  ),
}

// Hero backdrop: a large dense grid, the headline use case from the JSDoc.
export const HeroBackdrop: Story = {
  render: () => <GeometricPattern rows={8} cols={16} seed={11} />,
}

// Section divider: a single thin row, the other stated use case.
export const SectionDivider: Story = {
  render: () => <GeometricPattern rows={1} cols={24} seed={3} />,
}

// Spread HTMLDivElement props: the container accepts any div attribute, here a
// fixed-height wrapper + className/style passthrough that constrains the grid.
export const ContainerProps: Story = {
  render: () => (
    <GeometricPattern
      rows={4}
      cols={8}
      className="rounded-lg overflow-hidden shadow-md"
      style={{ maxWidth: 480 }}
      data-testid="geometric-pattern"
    />
  ),
}
