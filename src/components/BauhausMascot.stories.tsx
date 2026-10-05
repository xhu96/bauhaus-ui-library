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

/** Inspect the character silhouette without the surrounding landing scenes. */
export const BodySilhouettes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 24, maxWidth: 760 }}>
      {(['standing', 'working', 'running'] as const).map((pose) => (
        <figure key={pose} style={{ margin: 0 }}>
          <BauhausMascot
            pose={pose}
            expression={pose === 'working' ? 'focused' : 'curious'}
            label={`${pose} Bauhaus dog`}
            style={{ display: 'block', width: '100%' }}
          />
          <figcaption style={{ textTransform: 'capitalize' }}>{pose}</figcaption>
        </figure>
      ))}
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

export const DirectionComparison: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 20 }}>
      {(['standing', 'working', 'running'] as const).map((pose) => (
        <section key={pose}>
          <h2 style={{ margin: '0 0 8px', textTransform: 'capitalize' }}>{pose}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
            {(['right', 'left'] as const).map((direction) => (
              <figure key={direction} style={{ margin: 0, minWidth: 0 }}>
                <BauhausMascot
                  pose={pose}
                  direction={direction}
                  scene
                  label={`${pose} mascot facing ${direction}`}
                  style={{ display: 'block', width: '100%' }}
                />
                <figcaption style={{ marginTop: 4 }}>{direction}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      ))}

      <section>
        <h2 style={{ margin: '0 0 8px' }}>Portrait</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
          {(['right', 'left'] as const).map((direction) => (
            <figure key={direction} style={{ margin: 0, minWidth: 0 }}>
              <BauhausMascot
                variant="portrait"
                direction={direction}
                label={`Mascot portrait facing ${direction}`}
                style={{ display: 'block', width: '100%' }}
              />
              <figcaption style={{ marginTop: 4 }}>{direction}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  ),
}
