import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from 'storybook/test'
import { SettingsExample } from './SettingsExample'
import { defaultSettings, type WorkspaceSettings } from './settingsModel'

const load = async () => ({ ...defaultSettings })
const save = async (value: WorkspaceSettings) => ({ ...value })

const meta = {
  title: 'Examples/Settings',
  component: SettingsExample,
  tags: ['autodocs'],
  args: { loadSettings: load, saveSettings: save },
  parameters: {
    docs: {
      description: {
        component:
          'Complete preview-only settings composition. Native controls, retained panels, asynchronous load/save, inline validation, retry without losing edits, discard confirmation and searchable members. The standalone example uses versioned browser storage; replace the injected adapters with your API.',
      },
    },
  },
} satisfies Meta<typeof SettingsExample>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const name = await canvas.findByRole('textbox', { name: /Workspace name/ })
    await userEvent.clear(name)
    await userEvent.type(name, 'My studio')
    await userEvent.click(canvas.getByRole('tab', { name: 'Notifications' }))
    await userEvent.click(canvas.getByRole('tab', { name: 'Profile' }))
    await expect(name).toHaveValue('My studio')
    await userEvent.click(canvas.getByRole('button', { name: 'Save changes' }))
    await expect(canvas.getByRole('status', { name: 'Save status' })).toHaveTextContent('Changes saved')
  },
}

export const EmptyTeam: Story = { args: { members: [] } }
export const Loading: Story = { args: { loadSettings: () => new Promise(() => {}) } }
export const LoadError: Story = {
  args: {
    loadSettings: async () => {
      throw new Error('The workspace is temporarily unavailable. Please try again.')
    },
  },
}

function RecoverableSave() {
  const [adapter] = useState(() => {
    let attempts = 0
    return async (value: WorkspaceSettings) => {
      if (++attempts === 1)
        throw new Error('The connection was interrupted. Your edits have been kept. Try saving again.')
      return { ...value }
    }
  })
  return <SettingsExample loadSettings={load} saveSettings={adapter} />
}

export const SaveRecovery: Story = {
  render: () => <RecoverableSave />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const name = await canvas.findByRole('textbox', { name: /Workspace name/ })
    await userEvent.type(name, ' edited')
    await userEvent.click(canvas.getByRole('button', { name: 'Save changes' }))
    await expect(await canvas.findByRole('alert')).toHaveTextContent('Your edits have been kept')
    await userEvent.click(canvas.getByRole('button', { name: 'Save changes' }))
    await expect(canvas.getByRole('status', { name: 'Save status' })).toHaveTextContent('Changes saved')
  },
}
