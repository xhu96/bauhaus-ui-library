import type { Meta, StoryObj } from '@storybook/react'
import { within, userEvent, expect } from '@storybook/test'
import { Tooltip } from './Tooltip'
import { Button } from './Button'

const meta = {
  title: 'Display/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {
    side: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
    delay: {
      control: { type: 'range', min: 0, max: 1000, step: 50 },
    },
    content: { control: 'text' },
    children: { control: 'text' },
  },
  args: {
    content: 'Tooltip content',
    side: 'top',
    delay: 150,
    children: 'Trigger',
  },
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className="flex justify-center p-12">
      <Tooltip {...args}>
        <Button color="blue">Hover me</Button>
      </Tooltip>
    </div>
  ),
}

export const Sides: Story = {
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-10 p-16">
      <Tooltip content="Top tooltip" side="top">
        <Button>Top</Button>
      </Tooltip>
      <Tooltip content="Bottom tooltip" side="bottom">
        <Button>Bottom</Button>
      </Tooltip>
      <Tooltip content="Left tooltip" side="left">
        <Button>Left</Button>
      </Tooltip>
      <Tooltip content="Right tooltip" side="right">
        <Button>Right</Button>
      </Tooltip>
    </div>
  ),
}

/** Instant tooltip: delay=0 shows immediately on hover/focus. */
export const NoDelay: Story = {
  args: { delay: 0, content: 'Appears instantly' },
  render: (args) => (
    <div className="flex justify-center p-12">
      <Tooltip {...args}>
        <Button>No delay</Button>
      </Tooltip>
    </div>
  ),
}

/** Long delay: documents that the tooltip waits before appearing. */
export const LongDelay: Story = {
  args: { delay: 700, content: 'Waited 700ms before showing' },
  render: (args) => (
    <div className="flex justify-center p-12">
      <Tooltip {...args}>
        <Button>Slow reveal</Button>
      </Tooltip>
    </div>
  ),
}

/** Long content wraps within max-w-xs across multiple lines. */
export const LongContent: Story = {
  args: {
    content:
      'This tooltip holds a much longer message that wraps onto multiple lines, demonstrating the max-w-xs constraint and leading-snug line height.',
  },
  render: (args) => (
    <div className="flex justify-center p-16">
      <Tooltip {...args}>
        <Button>Long content</Button>
      </Tooltip>
    </div>
  ),
}

/** Rich ReactNode content: arbitrary JSX, not just plain strings. */
export const RichContent: Story = {
  args: {
    content: (
      <span>
        Press <strong>⌘K</strong> to open
      </span>
    ),
  },
  render: (args) => (
    <div className="flex justify-center p-12">
      <Tooltip {...args}>
        <Button>Rich content</Button>
      </Tooltip>
    </div>
  ),
}

/**
 * String trigger: when children is not a valid element, it is rendered as-is
 * and the aria-describedby cloneElement branch is skipped.
 */
export const StringTrigger: Story = {
  args: { content: 'Tooltip on plain text', children: 'Plain text trigger' },
  render: (args) => (
    <div className="flex justify-center p-12">
      <Tooltip {...args} />
    </div>
  ),
}

/**
 * Keyboard focus: the trigger reveals the tooltip on focus and hides on blur,
 * a core accessibility feature. The play function tabs to the trigger and
 * asserts the tooltip becomes visible with aria-describedby wired up.
 */
export const KeyboardFocus: Story = {
  args: { delay: 0, content: 'Revealed via keyboard focus' },
  render: (args) => (
    <div className="flex justify-center p-12">
      <Tooltip {...args}>
        <Button>Focus me</Button>
      </Tooltip>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Focus me' })

    await userEvent.tab()
    await expect(trigger).toHaveFocus()

    const tip = await canvas.findByRole('tooltip')
    await expect(tip).toBeVisible()
    await expect(tip).toHaveTextContent('Revealed via keyboard focus')
    await expect(trigger).toHaveAttribute('aria-describedby', tip.id)
  },
}
