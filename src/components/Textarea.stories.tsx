import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { Textarea } from './Textarea'

const meta = {
  title: 'Form/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    required: { control: 'boolean' },
    placeholder: { control: 'text' },
    rows: { control: { type: 'number', min: 1, max: 30 } },
    maxLength: { control: 'number' },
  },
  args: {
    placeholder: 'Write something...',
    error: false,
    disabled: false,
    onChange: fn(),
  },
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithValue: Story = {
  args: {
    defaultValue: 'The Bauhaus combined crafts and the fine arts.',
  },
}

export const Error: Story = {
  args: {
    error: true,
    defaultValue: 'This field has a problem.',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 'You cannot edit this.',
  },
}

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    defaultValue: 'You can select and copy this, but not edit it.',
  },
}

export const Tall: Story = {
  args: {
    rows: 10,
    defaultValue:
      'The Bauhaus was founded by Walter Gropius in Weimar in 1919.\n\n' +
      'It combined crafts and the fine arts, and was famous for its approach ' +
      'to design that it taught and publicised. This textarea uses a fixed ' +
      'min-height and vertical resize handle, so drag the bottom edge to grow ' +
      'or shrink it.\n\nForm follows function.',
  },
}
