import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { useState } from 'react'
import { Tag } from './Tag'

const meta = {
  title: 'Display/Tag',
  component: Tag,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['red', 'blue', 'yellow', 'ink'],
    },
    dot: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: {
    children: 'Design',
    color: 'ink',
    onRemove: fn(),
  },
} satisfies Meta<typeof Tag>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithDot: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Tag dot color="red">
        Bug
      </Tag>
      <Tag dot color="blue">
        Feature
      </Tag>
      <Tag dot color="yellow">
        Docs
      </Tag>
      <Tag dot color="ink">
        Chore
      </Tag>
    </div>
  ),
}

export const Removable: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Tag color="blue" onRemove={() => {}}>
        TypeScript
      </Tag>
      <Tag color="red" dot onRemove={() => {}}>
        React
      </Tag>
    </div>
  ),
}

/** All four palette colors with their distinct remove-button (X) treatments —
 *  yellow renders coal-on-byellow and ink renders paper-on-ink, neither of
 *  which appears in the Removable story. */
export const RemovableColors: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Tag color="red" onRemove={() => {}}>
        Red
      </Tag>
      <Tag color="blue" onRemove={() => {}}>
        Blue
      </Tag>
      <Tag color="yellow" onRemove={() => {}}>
        Yellow
      </Tag>
      <Tag color="ink" onRemove={() => {}}>
        Ink
      </Tag>
    </div>
  ),
}

/** Clicking the X actually removes the tag from a stateful list — the
 *  component's single real behavior, which the static stories never exercise. */
export const InteractiveRemove: Story = {
  render: () => {
    const [tags, setTags] = useState<
      { id: number; label: string; color: 'red' | 'blue' | 'yellow' | 'ink' }[]
    >([
      { id: 1, label: 'Design', color: 'red' },
      { id: 2, label: 'Engineering', color: 'blue' },
      { id: 3, label: 'Research', color: 'yellow' },
      { id: 4, label: 'Ops', color: 'ink' },
    ])
    return (
      <div className="flex flex-wrap items-center gap-3">
        {tags.length === 0 ? (
          <span className="font-display text-sm text-ink-soft">All tags removed.</span>
        ) : (
          tags.map((tag) => (
            <Tag
              key={tag.id}
              dot
              color={tag.color}
              onRemove={() => setTags((prev) => prev.filter((t) => t.id !== tag.id))}
            >
              {tag.label}
            </Tag>
          ))
        )}
      </div>
    )
  },
}
