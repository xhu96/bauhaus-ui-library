import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Slider } from './Slider'

const meta = {
  title: 'Form/Slider',
  component: Slider,
  tags: ['autodocs'],
  args: {
    color: 'red',
    min: 0,
    max: 100,
    disabled: false,
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
  render: () => <SliderDemo />,
}

export const Blue: Story = {
  args: { color: 'blue', defaultValue: 60 },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 30 },
}
