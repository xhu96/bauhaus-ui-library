import type { Meta, StoryObj } from '@storybook/react'
import { useId, useState } from 'react'
import { FormField } from './FormField'
import { Input } from './Input'

const meta = {
  title: 'Form/FormField',
  component: FormField,
  tags: ['autodocs'],
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
      <div className="w-80">
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
      <div className="w-80">
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
      <div className="w-80">
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
    <div className="w-80">
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
