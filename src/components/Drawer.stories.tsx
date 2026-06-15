import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Drawer } from './Drawer'
import { Button } from './Button'

const meta = {
  title: 'Overlay/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  args: {
    open: false,
    onClose: () => {},
  },
} satisfies Meta<typeof Drawer>

export default meta
type Story = StoryObj<typeof meta>

function DrawerDemo({ side }: { side: 'left' | 'right' }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open {side} Drawer</Button>
      <Drawer open={open} onClose={() => setOpen(false)} side={side} title="Menu">
        <p className="text-ink">Drawer content goes here.</p>
        <Button className="mt-4" onClick={() => setOpen(false)}>
          Close
        </Button>
      </Drawer>
    </>
  )
}

export const Default: Story = {
  render: () => <DrawerDemo side="right" />,
}

export const Left: Story = {
  render: () => <DrawerDemo side="left" />,
}
