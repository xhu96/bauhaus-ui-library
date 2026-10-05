import type { Meta, StoryObj } from '@storybook/react'
import { within, userEvent, expect, fn } from 'storybook/test'
import { useState } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from './Modal'
import { Button } from './Button'

const meta = {
  title: 'Overlay/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    open: { control: 'boolean' },
    title: { control: 'text' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    closeOnBackdrop: { control: 'boolean' },
  },
  args: {
    open: false,
    onClose: fn(),
  },
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

function ModalDemo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Confirm action">
        <ModalBody>Are you sure you want to proceed? This cannot be undone.</ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button color="red" onClick={() => setOpen(false)}>
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

export const Default: Story = {
  render: () => <ModalDemo />,
}

function LargeModalDemo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Large Modal</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Details" size="lg">
        <ModalBody>A wider panel for richer content.</ModalBody>
        <ModalFooter>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

export const Large: Story = {
  render: () => <LargeModalDemo />,
}

function SmallModalDemo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Small Modal</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Quick note" size="sm">
        <ModalBody>A compact panel for short, focused content.</ModalBody>
        <ModalFooter>
          <Button onClick={() => setOpen(false)}>Got it</Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

export const Small: Story = {
  render: () => <SmallModalDemo />,
}

function TitlelessModalDemo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Titleless Modal</Button>
      <Modal open={open} onClose={() => setOpen(false)} aria-label="Quick information">
        <ModalBody>
          Omit the visible header when appropriate, and provide an aria-label so the dialog still has an
          accessible name.
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

export const Titleless: Story = {
  render: () => <TitlelessModalDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole('button', { name: 'Open Titleless Modal' }))
    await expect(await body.findByRole('dialog', { name: 'Quick information' })).toBeVisible()
    await userEvent.click(body.getAllByRole('button', { name: 'Close' })[0])
  },
}

function CustomHeaderModalDemo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Custom Header Modal</Button>
      <Modal open={open} onClose={() => setOpen(false)} aria-label="Custom composition">
        <ModalHeader>
          <h2 className="bui-font-display bui-text-xl bui-font-bold bui-tracking-tight bui-text-ink">
            Custom composition
          </h2>
          <p className="bui-mt-1 bui-text-sm bui-text-ink/70">
            Built from the exported ModalHeader sub-part.
          </p>
        </ModalHeader>
        <ModalBody>
          Compose the header manually when you need more than a plain title, and name the dialog with
          aria-label.
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

export const CustomHeader: Story = {
  render: () => <CustomHeaderModalDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole('button', { name: 'Open Custom Header Modal' }))
    await expect(await body.findByRole('dialog', { name: 'Custom composition' })).toBeVisible()
  },
}

function NonDismissableModalDemo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Non-dismissable Modal</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Action required" closeOnBackdrop={false}>
        <ModalBody>
          Clicking the backdrop will not close this modal. Use the explicit action instead.
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => setOpen(false)}>Confirm</Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

export const NonDismissableBackdrop: Story = {
  render: () => <NonDismissableModalDemo />,
}

export const OpensAndCloses: Story = {
  render: () => <ModalDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)

    // Open the modal via the trigger button.
    const trigger = await canvas.findByRole('button', { name: /open modal/i })
    await userEvent.click(trigger)

    // The portalled dialog mounts on document.body, so query there.
    const dialog = await body.findByRole('dialog')
    await expect(dialog).toBeInTheDocument()

    // Close via the built-in close button and assert the dialog is gone.
    const closeButton = await body.findByRole('button', { name: /close/i })
    await userEvent.click(closeButton)
    await expect(body.queryByRole('dialog')).not.toBeInTheDocument()
  },
}
