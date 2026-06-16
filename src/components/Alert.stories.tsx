import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Megaphone } from 'lucide-react'
import { fn } from '@storybook/test'
import { Alert } from './Alert'

const meta = {
  title: 'Display/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['info', 'success', 'warning', 'danger'],
    },
    title: { control: 'text' },
    onClose: { control: false },
  },
  args: {
    status: 'info',
    title: 'Heads up',
    children: 'This is an informational message for the user.',
    onClose: fn(),
  },
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className="w-96">
      <Alert {...args} />
    </div>
  ),
}

export const Statuses: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-4">
      <Alert status="info" title="Information">
        A neutral, informative note.
      </Alert>
      <Alert status="success" title="Success">
        Your changes were saved.
      </Alert>
      <Alert status="warning" title="Warning">
        Double-check your input before continuing.
      </Alert>
      <Alert status="danger" title="Error">
        Something went wrong. Please try again.
      </Alert>
    </div>
  ),
}

export const Dismissible: Story = {
  render: () => (
    <div className="w-96">
      <Alert status="warning" title="Dismissible" onClose={() => {}}>
        Click the X button to dismiss this alert.
      </Alert>
    </div>
  ),
}

export const TitleOnly: Story = {
  render: () => (
    <div className="w-96">
      <Alert status="success" title="Saved successfully" />
    </div>
  ),
}

export const BodyOnly: Story = {
  render: () => (
    <div className="w-96">
      <Alert status="info">A standalone message with no title; the body has no top margin.</Alert>
    </div>
  ),
}

export const CustomIcon: Story = {
  render: () => (
    <div className="w-96">
      <Alert status="info" title="New release" icon={<Megaphone className="h-5 w-5" aria-hidden />}>
        Override the default status icon via the icon prop.
      </Alert>
    </div>
  ),
}

export const InteractiveDismiss: Story = {
  render: () => {
    const [visible, setVisible] = useState(true)
    return (
      <div className="w-96">
        {visible ? (
          <Alert status="warning" title="Dismiss me" onClose={() => setVisible(false)}>
            Clicking the X actually unmounts this alert.
          </Alert>
        ) : (
          <button
            type="button"
            onClick={() => setVisible(true)}
            className="press border-3 border-ink bg-surface px-3 py-1.5 text-sm text-ink hover:bg-ink hover:text-paper"
          >
            Show alert again
          </button>
        )}
      </div>
    )
  },
}
