import type { Meta, StoryObj } from '@storybook/react'
import { within, expect } from 'storybook/test'
import { useId, useState } from 'react'
import { FormField } from './FormField'
import { Input } from './Input'

const meta = {
  title: 'Form/FormField',
  component: FormField,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    required: { control: 'boolean' },
    htmlFor: { control: 'text' },
    className: { control: 'text' },
    children: { control: false },
  },
  args: {
    label: 'Email',
    hint: "We'll never share your email.",
    children: null,
  },
} satisfies Meta<typeof FormField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => {
    const id = useId()
    return (
      <div className="bui-w-80">
        <FormField {...args} htmlFor={id}>
          <Input id={id} type="email" placeholder="you@example.com" />
        </FormField>
      </div>
    )
  },
}

export const Required: Story = {
  render: () => {
    const id = useId()
    return (
      <div className="bui-w-80">
        <FormField label="Full name" required htmlFor={id}>
          <Input id={id} placeholder="Jane Doe" />
        </FormField>
      </div>
    )
  },
}

export const WithError: Story = {
  render: () => {
    const id = useId()
    return (
      <div className="bui-w-80">
        <FormField label="Password" error="Password must be at least 8 characters." htmlFor={id}>
          <Input id={id} type="password" error defaultValue="abc" />
        </FormField>
      </div>
    )
  },
}

function LiveValidation() {
  const id = useId()
  const [value, setValue] = useState('')
  const isValid = value.includes('@')
  return (
    <div className="bui-w-80">
      <FormField
        label="Email"
        htmlFor={id}
        hint={isValid ? 'Looks good!' : undefined}
        error={!isValid && value ? 'Enter a valid email address.' : undefined}
      >
        <Input
          id={id}
          type="email"
          placeholder="you@example.com"
          value={value}
          error={!isValid && value.length > 0}
          onChange={(e) => setValue(e.target.value)}
        />
      </FormField>
    </div>
  )
}

export const LiveValidationExample: Story = {
  render: () => <LiveValidation />,
}

export const NoLabel: Story = {
  render: () => {
    const id = useId()
    return (
      <div className="bui-w-80">
        <FormField hint="A control without a visible label still needs an accessible name." htmlFor={id}>
          <Input id={id} aria-label="Search projects" placeholder="Search projects" />
        </FormField>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('textbox', { name: 'Search projects' })).toHaveAccessibleDescription(
      'A control without a visible label still needs an accessible name.',
    )
  },
}

export const RequiredWithError: Story = {
  render: () => {
    const id = useId()
    return (
      <div className="bui-w-80">
        <FormField label="Email" required error="This field is required." htmlFor={id}>
          <Input id={id} type="email" error placeholder="you@example.com" />
        </FormField>
      </div>
    )
  },
}

export const ErrorOverridesHint: Story = {
  render: () => {
    const id = useId()
    return (
      <div className="bui-w-80">
        <FormField
          label="Password"
          hint="Use 8 or more characters."
          error="Password is too short."
          htmlFor={id}
        >
          <Input id={id} type="password" error defaultValue="abc" />
        </FormField>
      </div>
    )
  },
}

export const LabelOnly: Story = {
  render: () => {
    const id = useId()
    return (
      <div className="bui-w-80">
        <FormField label="Username" htmlFor={id}>
          <Input id={id} placeholder="jane.doe" />
        </FormField>
      </div>
    )
  },
}

export const WithCustomClassName: Story = {
  render: () => {
    const id = useId()
    return (
      <div className="bui-w-80">
        <FormField
          label="Notes"
          hint="Custom className adds extra vertical gap."
          htmlFor={id}
          className="bui-gap-4 rounded-base bui-border-2 bui-border-ink bui-bg-surface bui-p-4"
        >
          <Input id={id} placeholder="Anything else?" />
        </FormField>
      </div>
    )
  },
}

export const StackedForm: Story = {
  render: () => {
    const firstId = useId()
    const lastId = useId()
    const emailId = useId()
    return (
      <form className="bui-flex bui-w-80 bui-flex-col bui-gap-5">
        <FormField label="First name" required htmlFor={firstId}>
          <Input id={firstId} placeholder="Jane" />
        </FormField>
        <FormField label="Last name" required htmlFor={lastId}>
          <Input id={lastId} placeholder="Doe" />
        </FormField>
        <FormField label="Email" hint="We'll never share your email." htmlFor={emailId}>
          <Input id={emailId} type="email" placeholder="you@example.com" />
        </FormField>
      </form>
    )
  },
}
