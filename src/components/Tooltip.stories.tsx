import type { Meta, StoryObj } from '@storybook/react'
import { Tooltip } from './Tooltip'
import { Button } from './Button'

const meta = {
  title: 'Display/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  args: {
    content: 'Tooltip content',
    side: 'top',
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
