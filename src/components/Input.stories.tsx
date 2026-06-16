import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { Mail, Search, Lock } from 'lucide-react'
import { Input } from './Input'

const meta = {
  title: 'Form/Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    placeholder: 'Type here…',
    inputSize: 'md',
    error: false,
    disabled: false,
    onChange: fn(),
  },
  argTypes: {
    inputSize: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    leftIcon: { control: false },
    rightIcon: { control: false },
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className="w-80">
      <Input {...args} />
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-3">
      <Input inputSize="sm" placeholder="Small" />
      <Input inputSize="md" placeholder="Medium" />
      <Input inputSize="lg" placeholder="Large" />
    </div>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-3">
      <Input leftIcon={<Mail className="h-4 w-4" />} placeholder="Email" type="email" />
      <Input rightIcon={<Search className="h-4 w-4" />} placeholder="Search" />
      <Input
        leftIcon={<Lock className="h-4 w-4" />}
        placeholder="Password"
        type="password"
      />
    </div>
  ),
}

export const ErrorState: Story = {
  render: () => (
    <div className="w-80">
      <Input error defaultValue="invalid@" leftIcon={<Mail className="h-4 w-4" />} />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="w-80">
      <Input disabled placeholder="Disabled input" />
    </div>
  ),
}

export const BothIcons: Story = {
  render: () => (
    <div className="w-80">
      <Input
        leftIcon={<Mail className="h-4 w-4" />}
        rightIcon={<Search className="h-4 w-4" />}
        placeholder="Search inbox"
      />
    </div>
  ),
}

export const IconsAllSizes: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-3">
      <Input inputSize="sm" leftIcon={<Mail className="h-3.5 w-3.5" />} placeholder="Small" />
      <Input inputSize="md" leftIcon={<Mail className="h-4 w-4" />} placeholder="Medium" />
      <Input inputSize="lg" leftIcon={<Mail className="h-5 w-5" />} placeholder="Large" />
    </div>
  ),
}

export const Filled: Story = {
  render: () => (
    <div className="w-80">
      <Input defaultValue="hello@bauhaus.dev" placeholder="Email" />
    </div>
  ),
}

export const DisabledWithIcon: Story = {
  render: () => (
    <div className="w-80">
      <Input disabled leftIcon={<Lock className="h-4 w-4" />} placeholder="Locked field" />
    </div>
  ),
}
