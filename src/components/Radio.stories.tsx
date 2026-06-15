import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { RadioGroup, Radio } from './Radio'

const meta = {
  title: 'Form/Radio',
  component: RadioGroup,
  tags: ['autodocs'],
  args: {
    children: null,
  },
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

function RadioDemo() {
  const [value, setValue] = useState('blue')
  return (
    <RadioGroup value={value} onValueChange={setValue}>
      <Radio value="red" label="Red" color="red" />
      <Radio value="blue" label="Blue" color="blue" />
      <Radio value="yellow" label="Yellow" color="yellow" />
    </RadioGroup>
  )
}

export const Default: Story = {
  render: () => <RadioDemo />,
}

export const Horizontal: Story = {
  render: () => (
    <RadioGroup defaultValue="a" orientation="horizontal">
      <Radio value="a" label="First" />
      <Radio value="b" label="Second" />
      <Radio value="c" label="Third" />
    </RadioGroup>
  ),
}

export const WithDisabled: Story = {
  render: () => (
    <RadioGroup defaultValue="a">
      <Radio value="a" label="Available" />
      <Radio value="b" label="Disabled" disabled />
    </RadioGroup>
  ),
}
