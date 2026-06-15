import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Modal, ModalBody, ModalFooter } from './Modal'
import { Button } from './Button'

const meta = {
  title: 'Overlay/Modal',
  component: Modal,
  tags: ['autodocs'],
  args: {
    open: false,
    onClose: () => {},
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
