import type { Meta, StoryObj } from '@storybook/react'
import { fn, within, userEvent, expect } from '@storybook/test'
import { ArrowRight, Download, Plus } from 'lucide-react'
import { Button } from './Button'

const meta = {
  title: 'Core/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['solid', 'outline', 'ghost'],
    },
    color: {
      control: 'select',
      options: ['red', 'blue', 'yellow', 'ink'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    fullWidth: { control: 'boolean' },
    isLoading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    children: 'Button',
    variant: 'solid',
    color: 'ink',
    size: 'md',
    onClick: fn(),
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

/**
 * Full variant x color matrix. The outline and ghost variants define classes
 * for every color (red/blue/yellow/ink), but the base stories only showed blue.
 */
export const VariantColorMatrix: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {(['solid', 'outline', 'ghost'] as const).map((variant) => (
        <div key={variant} className="flex flex-wrap items-center gap-3">
          {(['ink', 'red', 'blue', 'yellow'] as const).map((color) => (
            <Button key={color} variant={variant} color={color}>
              {variant}/{color}
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
}

/**
 * isLoading interplay with icons: the spinner REPLACES leftIcon, and rightIcon
 * is SUPPRESSED entirely while loading. Compare the idle and loading rows.
 */
export const LoadingWithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button leftIcon={<Plus className="h-[1.1em] w-[1.1em]" />}>Add</Button>
      <Button leftIcon={<Plus className="h-[1.1em] w-[1.1em]" />} isLoading>
        Add
      </Button>
      <Button rightIcon={<ArrowRight className="h-[1.1em] w-[1.1em]" />} color="blue">
        Next
      </Button>
      <Button rightIcon={<ArrowRight className="h-[1.1em] w-[1.1em]" />} color="blue" isLoading>
        Next
      </Button>
    </div>
  ),
}

/**
 * Disabled across every variant: solid and outline keep their border but drop
 * the press-hard shadow (disabled:shadow-none), ghost has no border at all.
 */
export const DisabledVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="solid" color="blue" disabled>
        Solid
      </Button>
      <Button variant="outline" color="blue" disabled>
        Outline
      </Button>
      <Button variant="ghost" color="blue" disabled>
        Ghost
      </Button>
      <Button isLoading>Loading</Button>
    </div>
  ),
}

/**
 * Proves the button fires onClick. Clicking the action invokes the spy exactly once.
 */
export const Clickable: Story = {
  args: {
    children: 'Click me',
    color: 'blue',
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const button = await canvas.findByRole('button', { name: /click me/i })
    await userEvent.click(button)
    await expect(args.onClick).toHaveBeenCalledTimes(1)
  },
}
