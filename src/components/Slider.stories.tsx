import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { useState } from 'react'
import { Slider } from './Slider'

const meta = {
  title: 'Form/Slider',
  component: Slider,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['red', 'blue', 'yellow', 'ink'],
    },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    disabled: { control: 'boolean' },
  },
  args: {
    color: 'red',
    min: 0,
    max: 100,
    disabled: false,
    onChange: fn(),
  },
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

function SliderDemo() {
  const [value, setValue] = useState(40)
  return (
    <div className="flex w-72 flex-col gap-2">
      <Slider
        min={0}
        max={100}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
      />
      <span className="font-display text-sm text-ink">Value: {value}</span>
    </div>
  )
}

export const Default: Story = {
  args: { defaultValue: 40 },
}

export const Controlled: Story = {
  render: () => <SliderDemo />,
}

export const Blue: Story = {
  args: { color: 'blue', defaultValue: 60 },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 30 },
}

export const AllColors: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-4">
      {(['red', 'blue', 'yellow', 'ink'] as const).map((color) => (
        <Slider key={color} {...args} color={color} defaultValue={60} />
      ))}
    </div>
  ),
}

export const Stepped: Story = {
  args: { step: 25, defaultValue: 50 },
}
