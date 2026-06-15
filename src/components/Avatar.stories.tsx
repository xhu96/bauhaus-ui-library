import type { Meta, StoryObj } from '@storybook/react'
import { Avatar } from './Avatar'

const meta = {
  title: 'Display/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  args: {
    name: 'Walter Gropius',
    size: 'md',
    shape: 'square',
    color: 'blue',
  },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Initials: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Avatar name="Walter Gropius" color="blue" />
      <Avatar name="Anni Albers" color="red" />
      <Avatar name="Paul Klee" color="yellow" />
      <Avatar name="Marcel" color="ink" />
    </div>
  ),
}

export const Image: Story = {
  args: {
    src: 'https://i.pravatar.cc/120?img=12',
    name: 'Photo user',
  },
}

export const Shapes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Avatar name="Square" shape="square" color="red" />
      <Avatar name="Circle" shape="circle" color="blue" />
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Avatar name="Small" size="sm" color="ink" />
      <Avatar name="Medium" size="md" color="ink" />
      <Avatar name="Large" size="lg" color="ink" />
      <Avatar name="Custom" size={80} color="yellow" />
    </div>
  ),
}
