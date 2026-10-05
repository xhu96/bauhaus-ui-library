import type { Meta, StoryObj } from '@storybook/react'
import { within, expect } from 'storybook/test'
import { Avatar } from './Avatar'

const meta = {
  title: 'Display/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['red', 'blue', 'yellow', 'ink'],
    },
    shape: {
      control: 'select',
      options: ['square', 'circle'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    src: { control: 'text' },
    name: { control: 'text' },
  },
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
    <div className="bui-flex bui-flex-wrap bui-items-center bui-gap-3">
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
    <div className="bui-flex bui-flex-wrap bui-items-center bui-gap-3">
      <Avatar name="Square" shape="square" color="red" />
      <Avatar name="Circle" shape="circle" color="blue" />
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="bui-flex bui-flex-wrap bui-items-center bui-gap-3">
      <Avatar name="Small" size="sm" color="ink" />
      <Avatar name="Medium" size="md" color="ink" />
      <Avatar name="Large" size="lg" color="ink" />
      <Avatar name="Custom" size={80} color="yellow" />
    </div>
  ),
}

/** No name: initials() falls back to "?" on a colored tile. */
export const Fallback: Story = {
  args: {
    name: '',
    color: 'yellow',
  },
}

/** Circular image: object-cover crop inside a round mask with the thick ink border. */
export const CircleImage: Story = {
  args: {
    src: 'https://i.pravatar.cc/120?img=12',
    name: 'Photo user',
    shape: 'circle',
  },
}

/** Failed image requests fall back to accessible initials. Changing src retries automatically. */
export const BrokenImage: Story = {
  args: {
    src: 'data:image/png;base64,broken',
    name: 'Missing image',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('MI')).toBeVisible()
    await expect(canvas.getByRole('img', { name: 'Missing image' })).toHaveTextContent('MI')
  },
}
