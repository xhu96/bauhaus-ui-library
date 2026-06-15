import type { Meta, StoryObj } from '@storybook/react'
import { Textarea } from './Textarea'

const meta = {
  title: 'Form/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  args: {
    placeholder: 'Write something...',
    error: false,
    disabled: false,
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
