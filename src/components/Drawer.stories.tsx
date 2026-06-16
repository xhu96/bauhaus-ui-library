import type { Meta, StoryObj } from '@storybook/react'
import { fn, within, userEvent, expect } from '@storybook/test'
import { useState } from 'react'
import { Drawer } from './Drawer'
import { Button } from './Button'

const meta = {
  title: 'Overlay/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  argTypes: {
    open: { control: 'boolean' },
    side: { control: 'select', options: ['left', 'right'] },
    title: { control: 'text' },
    width: { control: { type: 'range', min: 240, max: 640, step: 20 } },
  },
  args: {
    open: false,
    onClose: fn(),
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

/** Statically open so the Controls panel drives the portalled panel directly. */
export const Open: Story = {
  args: {
    open: true,
    title: 'Settings',
    children: <p className="text-ink">This drawer is open by default.</p>,
  },
}

/** No `title`: exercises the empty header placeholder and undefined aria-label branch. */
export const NoTitle: Story = {
  args: {
    open: true,
    children: <p className="text-ink">A drawer without a header title.</p>,
  },
}

/** Narrow panel via the `width` prop. */
export const NarrowWidth: Story = {
  args: {
    open: true,
    title: 'Narrow',
    width: 280,
    children: <p className="text-ink">A compact 280px panel.</p>,
  },
}

/** Wide panel via the `width` prop. */
export const WideWidth: Story = {
  args: {
    open: true,
    title: 'Wide',
    width: 560,
    children: <p className="text-ink">A roomy 560px panel.</p>,
  },
}

/** Long content to exercise the scrollable body and the body-scroll lock. */
export const LongContent: Story = {
  args: {
    open: true,
    title: 'Long Content',
    children: (
      <div className="space-y-4">
        {Array.from({ length: 30 }, (_, i) => (
          <p key={i} className="text-ink">
            Scrollable paragraph {i + 1}.
          </p>
        ))}
      </div>
    ),
  },
}

/** Verifies the close button fires onClose. Drawer is portalled, so query document.body. */
export const ClosesOnButton: Story = {
  args: {
    open: true,
    title: 'Closable',
    children: <p className="text-ink">Click the close button to dismiss.</p>,
  },
  play: async ({ args }) => {
    const body = within(document.body)
    const dialog = await body.findByRole('dialog')
    await expect(dialog).toBeInTheDocument()
    const closeButton = await body.findByRole('button', { name: /close/i })
    await userEvent.click(closeButton)
    await expect(args.onClose).toHaveBeenCalled()
  },
}
