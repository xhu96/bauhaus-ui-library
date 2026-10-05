import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from 'storybook/test'
import { InstallationExample, NativeFormExample } from './Onboarding'

const meta = {
  title: 'Examples/Onboarding',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '0.2.0dev2 (package 0.2.0-dev.2 on Dev) is unpublished. npm currently installs 0.1.1. The installation Button example uses the published API; native form/reset behavior below requires the local preview. See Introduction for exact installation steps.',
      },
    },
  },
} satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

export const Installation: Story = {
  render: () => <InstallationExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Build with Bauhaus' }))
    await expect(canvas.getByRole('status')).toHaveTextContent('Button works')
  },
}

export const NativeForm: Story = {
  render: () => <NativeFormExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByRole('textbox', { name: 'Name' }), 'Ada')
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Consent' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Submit' }))
    await expect(canvas.getByRole('status')).toHaveTextContent('Ada: consent on; notifications on')
    await userEvent.click(canvas.getByRole('button', { name: 'Reset' }))
    await expect(canvas.getByRole('textbox', { name: 'Name' })).toHaveValue('')
    await expect(canvas.getByRole('checkbox', { name: 'Consent' })).not.toBeChecked()
  },
}
