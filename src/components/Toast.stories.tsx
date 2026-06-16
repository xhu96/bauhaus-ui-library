import type { Meta, StoryObj } from '@storybook/react'
import { within, userEvent, expect } from '@storybook/test'
import { useState } from 'react'
import { ToastProvider, useToast } from './Toast'
import { Button } from './Button'

const meta = {
  title: 'Overlay/Toast',
  component: ToastProvider,
  tags: ['autodocs'],
  args: {
    children: null,
  },
  argTypes: {
    position: {
      control: 'select',
      options: ['top-right', 'bottom-right'],
      description: 'Corner the toast viewport is anchored to.',
    },
    children: {
      control: false,
    },
  },
} satisfies Meta<typeof ToastProvider>

export default meta
type Story = StoryObj<typeof meta>

function ToastButtons() {
  const { toast } = useToast()
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        color="blue"
        onClick={() => toast({ title: 'Heads up', description: 'Something informative.', status: 'info' })}
      >
        Info
      </Button>
      <Button
        color="blue"
        onClick={() => toast({ title: 'Saved', description: 'Your changes are saved.', status: 'success' })}
      >
        Success
      </Button>
      <Button
        color="yellow"
        onClick={() => toast({ title: 'Careful', description: 'Double-check this.', status: 'warning' })}
      >
        Warning
      </Button>
      <Button
        color="red"
        onClick={() => toast({ title: 'Error', description: 'Something went wrong.', status: 'danger' })}
      >
        Danger
      </Button>
    </div>
  )
}

export const Default: Story = {
  render: () => (
    <ToastProvider>
      <ToastButtons />
    </ToastProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)
    await userEvent.click(await canvas.findByRole('button', { name: 'Saved' }))
    // Toast viewport is portalled to document.body, so query there.
    await expect(await body.findByText('Saved')).toBeInTheDocument()
    await expect(await body.findByText('Your changes are saved.')).toBeInTheDocument()
  },
}

// Gap: position="top-right" is never demonstrated; it switches the viewport anchor.
function TopRightDemo() {
  const { toast } = useToast()
  return (
    <Button
      color="blue"
      onClick={() => toast({ title: 'Top-right', description: 'Anchored to the top.', status: 'info' })}
    >
      Show top-right toast
    </Button>
  )
}

export const TopRightPosition: Story = {
  render: () => (
    <ToastProvider position="top-right">
      <TopRightDemo />
    </ToastProvider>
  ),
}

// Gap: no custom-duration / persistent coverage. duration: 0 disables auto-dismiss.
function DurationDemo() {
  const { toast } = useToast()
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        color="blue"
        onClick={() => toast({ title: 'Quick', description: 'Gone in 1s.', status: 'info', duration: 1000 })}
      >
        1s toast
      </Button>
      <Button
        color="yellow"
        onClick={() =>
          toast({ title: 'Persistent', description: 'Stays until dismissed.', status: 'warning', duration: 0 })
        }
      >
        Persistent (duration: 0)
      </Button>
    </div>
  )
}

export const CustomDuration: Story = {
  render: () => (
    <ToastProvider>
      <DurationDemo />
    </ToastProvider>
  ),
}

// Gap: no stacking / multiple-toasts story. The viewport is a flex column built to stack.
function StackDemo() {
  const { toast } = useToast()
  return (
    <Button
      color="blue"
      onClick={() => {
        toast({ title: 'First', description: 'Toast one.', status: 'info', duration: 0 })
        toast({ title: 'Second', description: 'Toast two.', status: 'success', duration: 0 })
        toast({ title: 'Third', description: 'Toast three.', status: 'warning', duration: 0 })
      }}
    >
      Stack three toasts
    </Button>
  )
}

export const Stacked: Story = {
  render: () => (
    <ToastProvider>
      <StackDemo />
    </ToastProvider>
  ),
}

// Gap: no title-only toast; description is optional and rendered behind a conditional.
function TitleOnlyDemo() {
  const { toast } = useToast()
  return (
    <Button color="blue" onClick={() => toast({ title: 'Copied to clipboard', status: 'success' })}>
      Show title-only toast
    </Button>
  )
}

export const TitleOnly: Story = {
  render: () => (
    <ToastProvider>
      <TitleOnlyDemo />
    </ToastProvider>
  ),
}

// Gap: no programmatic dismiss(id) story. toast() returns the id; dismiss(id) removes it.
function ProgrammaticDismissDemo() {
  const { toast, dismiss } = useToast()
  const [id, setId] = useState<string | null>(null)
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        color="blue"
        onClick={() =>
          setId(toast({ title: 'Uploading…', description: 'Hold tight.', status: 'info', duration: 0 }))
        }
      >
        Start upload
      </Button>
      <Button
        color="red"
        onClick={() => {
          if (id) dismiss(id)
          setId(null)
        }}
      >
        Cancel (dismiss by id)
      </Button>
    </div>
  )
}

export const ProgrammaticDismiss: Story = {
  render: () => (
    <ToastProvider>
      <ProgrammaticDismissDemo />
    </ToastProvider>
  ),
}
