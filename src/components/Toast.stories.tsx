import type { Meta, StoryObj } from '@storybook/react'
import { ToastProvider, useToast } from './Toast'
import { Button } from './Button'

const meta = {
  title: 'Overlay/Toast',
  component: ToastProvider,
  tags: ['autodocs'],
  args: {
    children: null,
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
}
