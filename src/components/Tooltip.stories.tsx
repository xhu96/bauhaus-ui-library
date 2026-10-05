import type { Meta, StoryObj } from '@storybook/react'
import { within, userEvent, expect } from 'storybook/test'
import { useId } from 'react'
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
    <div className="bui-flex bui-justify-center bui-p-12">
      <Tooltip {...args}>
        <Button color="blue">Hover me</Button>
      </Tooltip>
    </div>
  ),
}

export const Sides: Story = {
  render: () => (
    <div className="bui-flex bui-flex-wrap bui-items-center bui-justify-center bui-gap-10 bui-p-16">
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
    <div className="bui-flex bui-justify-center bui-p-12">
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
    <div className="bui-flex bui-justify-center bui-p-12">
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
    <div className="bui-flex bui-justify-center bui-p-16">
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
    <div className="bui-flex bui-justify-center bui-p-12">
      <Tooltip {...args}>
        <Button>Rich content</Button>
      </Tooltip>
    </div>
  ),
}

/**
 * String trigger: the wrapper becomes a keyboard focus target and receives
 * aria-describedby while the tooltip is visible.
 */
export const StringTrigger: Story = {
  args: { content: 'Tooltip on plain text', children: 'Plain text trigger' },
  render: (args) => (
    <div className="bui-flex bui-justify-center bui-p-12">
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
    <div className="bui-flex bui-justify-center bui-p-12">
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

    const tip = await within(canvasElement.ownerDocument.body).findByRole('tooltip')
    await expect(tip).toBeVisible()
    await expect(tip).toHaveTextContent('Revealed via keyboard focus')
    await expect(trigger).toHaveAttribute('aria-describedby', tip.id)
  },
}

function SharedControlsDemo() {
  const descriptionId = useId()
  return (
    <div className="bui-flex bui-flex-col bui-items-center bui-gap-3 bui-p-6">
      <p id={descriptionId}>Both actions use the current project.</p>
      <Tooltip content="You can change the project in settings." delay={0}>
        <div className="bui-flex bui-flex-wrap bui-gap-3">
          <Button aria-describedby={descriptionId}>Preview project</Button>
          <Button aria-describedby={descriptionId}>Export project</Button>
        </div>
      </Tooltip>
    </div>
  )
}

/** A shared tooltip follows the focused control while retaining each control's own description. */
export const SharedControls: Story = {
  render: () => <SharedControlsDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    const preview = canvas.getByRole('button', { name: 'Preview project' })
    const exportButton = canvas.getByRole('button', { name: 'Export project' })
    const ownDescription = preview.getAttribute('aria-describedby')

    await userEvent.tab()
    const tip = await body.findByRole('tooltip')
    await expect(preview).toHaveAttribute('aria-describedby', `${ownDescription} ${tip.id}`)

    await userEvent.tab()
    await expect(exportButton).toHaveFocus()
    await expect(exportButton).toHaveAttribute('aria-describedby', `${ownDescription} ${tip.id}`)
    await expect(preview).toHaveAttribute('aria-describedby', ownDescription)

    await userEvent.keyboard('{Escape}')
    await expect(exportButton).toHaveAttribute('aria-describedby', ownDescription)
    await expect(body.queryByRole('tooltip')).not.toBeInTheDocument()
  },
}
