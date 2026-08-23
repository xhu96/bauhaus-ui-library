import type { Meta, StoryObj } from '@storybook/react'
import { BauhausMascot } from './BauhausMascot'

const meta = {
  title: 'Foundations/BauhausMascot',
  component: BauhausMascot,
  tags: ['autodocs'],
  argTypes: {
    pose: {
      control: 'select',
      options: ['standing', 'working', 'running'],
    },
    variant: {
      control: 'select',
      options: ['full', 'portrait'],
    },
    expression: {
      control: 'select',
      options: ['curious', 'focused', 'happy', 'playful', 'proud', 'calm'],
    },
    direction: {
      control: 'inline-radio',
      options: ['left', 'right'],
    },
    scene: { control: 'boolean' },
    label: { control: 'text' },
  },
  args: {
    pose: 'standing',
    variant: 'full',
    expression: 'curious',
    direction: 'right',
    scene: false,
    label: 'Bauhaus dog mascot',
  },
} satisfies Meta<typeof BauhausMascot>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => <BauhausMascot {...args} style={{ width: 420, maxWidth: '100%' }} />,
}

export const LandingScenes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      <BauhausMascot pose="standing" scene style={{ width: 760, maxWidth: '100%' }} />
      <BauhausMascot pose="working" scene style={{ width: 520, maxWidth: '100%' }} />
      <BauhausMascot pose="running" scene style={{ width: 760, maxWidth: '100%' }} />
    </div>
  ),
}

export const Expressions: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 20 }}>
      {(['curious', 'focused', 'happy', 'playful', 'proud', 'calm'] as const).map((expression) => (
        <BauhausMascot key={expression} variant="portrait" expression={expression} />
      ))}
    </div>
  ),
}
