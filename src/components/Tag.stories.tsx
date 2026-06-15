import type { Meta, StoryObj } from '@storybook/react'
import { Tag } from './Tag'

const meta = {
  title: 'Display/Tag',
  component: Tag,
  tags: ['autodocs'],
  args: {
    children: 'Design',
    color: 'ink',
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
