import type { Meta, StoryObj } from '@storybook/react'
import { Alert } from './Alert'

const meta = {
  title: 'Display/Alert',
  component: Alert,
  tags: ['autodocs'],
  args: {
    status: 'info',
    title: 'Heads up',
    children: 'This is an informational message for the user.',
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
