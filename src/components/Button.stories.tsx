import type { Meta, StoryObj } from '@storybook/react'
import { ArrowRight, Download, Plus } from 'lucide-react'
import { Button } from './Button'

const meta = {
  title: 'Core/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Button',
    variant: 'solid',
    color: 'ink',
    size: 'md',
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Colors: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button color="ink">Ink</Button>
      <Button color="red">Red</Button>
      <Button color="blue">Blue</Button>
      <Button color="yellow">Yellow</Button>
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="solid" color="blue">
        Solid
      </Button>
      <Button variant="outline" color="blue">
        Outline
      </Button>
      <Button variant="ghost" color="blue">
        Ghost
      </Button>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button leftIcon={<Plus className="h-[1.1em] w-[1.1em]" />}>Add item</Button>
      <Button rightIcon={<ArrowRight className="h-[1.1em] w-[1.1em]" />} color="red">
        Next
      </Button>
      <Button leftIcon={<Download className="h-[1.1em] w-[1.1em]" />} variant="outline" color="blue">
        Download
      </Button>
    </div>
  ),
}

export const Loading: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button isLoading>Saving</Button>
      <Button isLoading color="red" variant="outline">
        Deleting
      </Button>
    </div>
  ),
}

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    color: 'blue',
    children: 'Full width',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled',
  },
}
