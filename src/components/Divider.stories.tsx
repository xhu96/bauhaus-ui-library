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
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    variant: { control: 'select', options: ['solid', 'dashed', 'dotted'] },
    color: { control: 'select', options: ['red', 'blue', 'yellow', 'ink'] },
    thickness: { control: { type: 'range', min: 1, max: 16, step: 1 } },
    label: { control: 'text' },
  },
} satisfies Meta<typeof Divider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className="bui-w-96">
      <Divider {...args} />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="bui-flex bui-w-96 bui-flex-col bui-gap-6">
      <Divider variant="solid" />
      <Divider variant="dashed" />
      <Divider variant="dotted" />
    </div>
  ),
}

export const Colors: Story = {
  render: () => (
    <div className="bui-flex bui-w-96 bui-flex-col bui-gap-6">
      <Divider color="red" thickness={4} />
      <Divider color="blue" thickness={4} />
      <Divider color="yellow" thickness={4} />
      <Divider color="ink" thickness={4} />
    </div>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <div className="bui-w-96">
      <Divider label="Or" color="ink" />
    </div>
  ),
}

export const Vertical: Story = {
  render: () => (
    <div className="bui-flex bui-h-16 bui-items-stretch bui-gap-4">
      <span className="bui-self-center bui-font-display bui-font-bold bui-text-ink">Left</span>
      <Divider orientation="vertical" thickness={4} color="red" />
      <span className="bui-self-center bui-font-display bui-font-bold bui-text-ink">Middle</span>
      <Divider orientation="vertical" thickness={4} color="blue" />
      <span className="bui-self-center bui-font-display bui-font-bold bui-text-ink">Right</span>
    </div>
  ),
}

/** Contrasts the default thickness (3) with progressively heavier lines. */
export const Thickness: Story = {
  render: () => (
    <div className="bui-flex bui-w-96 bui-flex-col bui-gap-6">
      <Divider thickness={1} />
      <Divider thickness={3} />
      <Divider thickness={6} />
      <Divider thickness={12} />
    </div>
  ),
}

/** Exercises the vertical render path with dashed and dotted variants. */
export const VerticalVariants: Story = {
  render: () => (
    <div className="bui-flex bui-h-16 bui-items-stretch bui-gap-6">
      <Divider orientation="vertical" variant="solid" thickness={4} />
      <Divider orientation="vertical" variant="dashed" thickness={4} />
      <Divider orientation="vertical" variant="dotted" thickness={4} />
    </div>
  ),
}

/** A ReactNode label (an icon) rather than a plain string. */
export const LabelNode: Story = {
  render: () => (
    <div className="bui-w-96">
      <Divider
        label={
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="8" cy="8" r="7" fill="currentColor" />
          </svg>
        }
        color="blue"
      />
    </div>
  ),
}

/**
 * Edge case: a `label` combined with `orientation="vertical"` is silently
 * dropped. The vertical branch returns before the label branch, so the label
 * never renders — pass `label` only with the (default) horizontal orientation.
 */
export const VerticalWithLabelDropped: Story = {
  render: () => (
    <div className="bui-flex bui-h-16 bui-items-stretch bui-gap-4">
      <span className="bui-self-center bui-font-display bui-font-bold bui-text-ink">Before</span>
      <Divider orientation="vertical" thickness={4} label="ignored" />
      <span className="bui-self-center bui-font-display bui-font-bold bui-text-ink">After</span>
    </div>
  ),
}
