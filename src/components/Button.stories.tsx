import type { Meta, StoryObj } from '@storybook/react'
import { fn, within, userEvent, expect } from 'storybook/test'
import { ArrowRight, Download, Plus } from 'lucide-react'
import { Button } from './Button'
import { FormField } from './FormField'
import { Input } from './Input'
import { Select } from './Select'
import { Textarea } from './Textarea'

const meta = {
  title: 'Core/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['solid', 'outline', 'ghost'],
    },
    intent: { control: 'select', options: [undefined, 'primary', 'secondary', 'destructive'] },
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
    <div className="bui-flex bui-flex-wrap bui-items-center bui-gap-3">
      <Button color="ink">Ink</Button>
      <Button color="red">Red</Button>
      <Button color="blue">Blue</Button>
      <Button color="yellow">Yellow</Button>
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="bui-flex bui-flex-wrap bui-items-center bui-gap-3">
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
    <div className="bui-flex bui-flex-wrap bui-items-center bui-gap-3">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <div className="bui-flex bui-flex-wrap bui-items-center bui-gap-3">
      <Button leftIcon={<Plus className="bui-h-[1.1em] bui-w-[1.1em]" />}>Add item</Button>
      <Button rightIcon={<ArrowRight className="bui-h-[1.1em] bui-w-[1.1em]" />} color="red">
        Next
      </Button>
      <Button leftIcon={<Download className="bui-h-[1.1em] bui-w-[1.1em]" />} variant="outline" color="blue">
        Download
      </Button>
    </div>
  ),
}

export const Loading: Story = {
  render: () => (
    <div className="bui-flex bui-flex-wrap bui-items-center bui-gap-3">
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
    <div className="bui-flex bui-flex-col bui-gap-3">
      {(['solid', 'outline', 'ghost'] as const).map((variant) => (
        <div key={variant} className="bui-flex bui-flex-wrap bui-items-center bui-gap-3">
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
    <div className="bui-flex bui-flex-wrap bui-items-center bui-gap-3">
      <Button leftIcon={<Plus className="bui-h-[1.1em] bui-w-[1.1em]" />}>Add</Button>
      <Button leftIcon={<Plus className="bui-h-[1.1em] bui-w-[1.1em]" />} isLoading>
        Add
      </Button>
      <Button rightIcon={<ArrowRight className="bui-h-[1.1em] bui-w-[1.1em]" />} color="blue">
        Next
      </Button>
      <Button rightIcon={<ArrowRight className="bui-h-[1.1em] bui-w-[1.1em]" />} color="blue" isLoading>
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
    <div className="bui-flex bui-flex-wrap bui-items-center bui-gap-3">
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

export const ActionHierarchy: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Opt into intent for product actions: primary is filled blue, secondary is a quiet ink outline, destructive is accessible red. Intent takes precedence over color and variant; omit it to preserve the original visual API.',
      },
    },
  },
  render: () => (
    <div className="bui-flex bui-flex-wrap bui-items-center bui-gap-4">
      <Button intent="primary">Save changes</Button>
      <Button intent="secondary">Cancel</Button>
      <Button intent="destructive">Delete project</Button>
    </div>
  ),
}

function DensityExample({ density }: { density: 'compact' | 'comfortable' }) {
  return (
    <div data-bui-density={density} className="bui-flex bui-max-w-md bui-flex-col bui-gap-4">
      <div className="bui-flex bui-flex-wrap bui-items-center bui-gap-3">
        <Button intent="secondary" size="sm">
          Small action
        </Button>
        <Button intent="primary" size="md">
          Medium action
        </Button>
        <Button intent="secondary" size="lg">
          Large action
        </Button>
      </div>
      <FormField label="Project name">
        <Input defaultValue="Bauhaus studio" />
      </FormField>
      <FormField label="Visibility">
        <Select
          options={[
            { label: 'Private', value: 'private' },
            { label: 'Public', value: 'public' },
          ]}
        />
      </FormField>
      <FormField label="Description">
        <Textarea defaultValue="A considered space for creative work." />
      </FormField>
      <div data-bui-density="comfortable">
        <Button intent="primary">Comfortable nested action</Button>
      </div>
    </div>
  )
}

export const CompactDensity: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'data-bui-density="compact" is an opt-in inherited scope: single-line controls use 32/36/44px for sm/md/lg. Textareas keep their rows and minimum height. A nested comfortable scope restores the original sizing.',
      },
    },
  },
  render: () => <DensityExample density="compact" />,
}

export const ComfortableDensity: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comfortable single-line controls use the existing 36/44/56px sm/md/lg heights. Controls outside any density scope retain the original visual behavior.',
      },
    },
  },
  render: () => <DensityExample density="comfortable" />,
}
