import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { SettingsExample } from './SettingsExample'
import { defaultSettings, type WorkspaceSettings } from './settingsModel'

const load = async () => ({ ...defaultSettings })

function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason: Error) => void
  const promise = new Promise<T>((yes, no) => {
    resolve = yes
    reject = no
  })
  return { promise, resolve, reject }
}

describe('Settings product flow', () => {
  it('loads asynchronously before exposing editable settings', async () => {
    const pending = deferred<WorkspaceSettings>()
    render(<SettingsExample loadSettings={() => pending.promise} />)
    expect(screen.getByRole('status', { name: 'Loading settings' })).toBeInTheDocument()
    expect(screen.queryByRole('textbox', { name: /Workspace name/ })).not.toBeInTheDocument()
    await act(async () => pending.resolve({ ...defaultSettings }))
    expect(screen.getByRole('textbox', { name: /Workspace name/ })).toHaveValue('Bauhaus Studio')
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeDisabled()
  })

  it('preserves edits across tabs, saves one snapshot and marks it clean after success', async () => {
    const user = userEvent.setup()
    const pending = deferred<WorkspaceSettings>()
    let submitted: WorkspaceSettings | undefined
    render(
      <SettingsExample
        loadSettings={load}
        saveSettings={(value) => {
          submitted = value
          return pending.promise
        }}
      />,
    )
    const name = await screen.findByRole('textbox', { name: /Workspace name/ })
    await user.clear(name)
    await user.type(name, 'New studio')
    await user.click(screen.getByRole('tab', { name: 'Notifications' }))
    await user.click(screen.getByRole('switch', { name: 'Email notifications' }))
    await user.click(screen.getByRole('tab', { name: 'Profile' }))
    expect(name).toHaveValue('New studio')
    await user.click(screen.getByRole('button', { name: 'Save changes' }))
    expect(screen.getByRole('button', { name: 'Saving changes' })).toBeDisabled()
    expect(name).toBeDisabled()
    expect(submitted).toEqual({
      name: 'New studio',
      email: 'studio@example.com',
      notifications: false,
      digest: 'weekly',
    })
    await act(async () => pending.resolve(submitted!))
    expect(screen.getByRole('status', { name: 'Save status' })).toHaveTextContent('Changes saved')
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeDisabled()
  })

  it('keeps failed edits and lets the same draft be retried', async () => {
    const user = userEvent.setup()
    let attempts = 0
    render(
      <SettingsExample
        loadSettings={load}
        saveSettings={async (value) => {
          if (++attempts === 1) throw new Error('Service unavailable')
          return value
        }}
      />,
    )
    const name = await screen.findByRole('textbox', { name: /Workspace name/ })
    await user.clear(name)
    await user.type(name, 'Retry studio')
    await user.click(screen.getByRole('button', { name: 'Save changes' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Service unavailable')
    expect(name).toHaveValue('Retry studio')
    await user.click(screen.getByRole('button', { name: 'Save changes' }))
    expect(await screen.findByRole('status', { name: 'Save status' })).toHaveTextContent('Changes saved')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('reveals and focuses an invalid profile field when saving from another tab', async () => {
    const user = userEvent.setup()
    render(<SettingsExample loadSettings={load} />)
    const email = await screen.findByRole('textbox', { name: /Contact email/ })
    await user.clear(email)
    await user.type(email, 'invalid')
    await user.click(screen.getByRole('tab', { name: 'Notifications' }))
    await user.click(screen.getByRole('button', { name: 'Save changes' }))
    expect(screen.getByRole('tab', { name: 'Profile' })).toHaveAttribute('aria-selected', 'true')
    expect(email).toHaveAttribute('aria-invalid', 'true')
    expect(email).toHaveFocus()
    expect(email).toHaveAccessibleDescription(/Enter a valid email address/)
  })

  it('keeps pending and failed save feedback visible when navigating to the team', async () => {
    const user = userEvent.setup()
    const pending = deferred<WorkspaceSettings>()
    render(<SettingsExample loadSettings={load} saveSettings={() => pending.promise} />)
    const name = await screen.findByRole('textbox', { name: /Workspace name/ })
    await user.type(name, ' changed')
    await user.click(screen.getByRole('button', { name: 'Save changes' }))
    await user.click(screen.getByRole('tab', { name: 'Team' }))
    expect(screen.getByRole('status', { name: 'Save status' })).toHaveTextContent('Saving your changes')
    await act(async () => pending.reject(new Error('Service unavailable')))
    expect(screen.getByRole('alert')).toHaveTextContent('Service unavailable')
    await user.click(screen.getByRole('tab', { name: 'Profile' }))
    expect(name).toHaveValue('Bauhaus Studio changed')
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeEnabled()
  })

  it('requires confirmation before discarding unsaved edits', async () => {
    const user = userEvent.setup()
    render(<SettingsExample loadSettings={load} />)
    const name = await screen.findByRole('textbox', { name: /Workspace name/ })
    await user.clear(name)
    await user.type(name, 'Unsaved')
    await user.click(screen.getByRole('button', { name: 'Discard changes' }))
    let dialog = screen.getByRole('dialog', { name: 'Discard unsaved changes?' })
    await user.click(within(dialog).getByRole('button', { name: 'Keep editing' }))
    expect(name).toHaveValue('Unsaved')
    await user.click(screen.getByRole('button', { name: 'Discard changes' }))
    dialog = screen.getByRole('dialog', { name: 'Discard unsaved changes?' })
    await user.click(within(dialog).getByRole('button', { name: 'Discard changes' }))
    expect(name).toHaveValue('Bauhaus Studio')
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeDisabled()
    expect(screen.getByRole('tab', { name: 'Profile' })).toHaveFocus()
  })

  it('distinguishes an empty team from a search with no matches', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<SettingsExample loadSettings={load} />)
    await screen.findByRole('textbox', { name: /Workspace name/ })
    await user.click(screen.getByRole('tab', { name: 'Team' }))
    await user.type(screen.getByRole('searchbox', { name: 'Search members' }), 'nobody')
    expect(screen.getByText('No members match your search.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Clear search' }))
    expect(screen.getByText('Anni Albers')).toBeInTheDocument()
    expect(screen.getByRole('searchbox', { name: 'Search members' })).toHaveFocus()
    unmount()
    render(<SettingsExample loadSettings={load} members={[]} />)
    await screen.findByRole('textbox', { name: /Workspace name/ })
    await user.click(screen.getByRole('tab', { name: 'Team' }))
    expect(screen.getByText('No team members yet.')).toBeInTheDocument()
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument()
  })

  it('retries loading after an initial failure', async () => {
    const user = userEvent.setup()
    let attempts = 0
    render(
      <SettingsExample
        loadSettings={async () => {
          if (++attempts === 1) throw new Error('Offline')
          return { ...defaultSettings }
        }}
      />,
    )
    expect(await screen.findByRole('alert')).toHaveTextContent('Offline')
    await user.click(screen.getByRole('button', { name: 'Try again' }))
    expect(await screen.findByRole('textbox', { name: /Workspace name/ })).toHaveValue('Bauhaus Studio')
  })

  it('aborts pending persistence when the page unmounts', async () => {
    const user = userEvent.setup()
    let saveSignal: AbortSignal | undefined
    const pending = deferred<WorkspaceSettings>()
    const { unmount } = render(
      <SettingsExample
        loadSettings={load}
        saveSettings={(_value, signal) => {
          saveSignal = signal
          return pending.promise
        }}
      />,
    )
    await user.type(await screen.findByRole('textbox', { name: /Workspace name/ }), ' changed')
    await user.click(screen.getByRole('button', { name: 'Save changes' }))
    unmount()
    expect(saveSignal?.aborted).toBe(true)
    await act(async () => pending.resolve({ ...defaultSettings }))
  })

  it('cancels an old save when the workspace loader changes', async () => {
    const user = userEvent.setup()
    const pending = deferred<WorkspaceSettings>()
    let signal: AbortSignal | undefined
    const save = (_value: WorkspaceSettings, request: AbortSignal) => {
      signal = request
      return pending.promise
    }
    const { rerender } = render(<SettingsExample loadSettings={load} saveSettings={save} />)
    await user.type(await screen.findByRole('textbox', { name: /Workspace name/ }), ' old')
    await user.click(screen.getByRole('button', { name: 'Save changes' }))
    rerender(
      <SettingsExample
        loadSettings={async () => ({ ...defaultSettings, name: 'Another workspace' })}
        saveSettings={save}
      />,
    )
    expect(await screen.findByRole('textbox', { name: /Workspace name/ })).toHaveValue('Another workspace')
    expect(signal?.aborted).toBe(true)
    await act(async () => pending.resolve({ ...defaultSettings, name: 'Old saved response' }))
    expect(screen.getByRole('textbox', { name: /Workspace name/ })).toHaveValue('Another workspace')
  })

  it('shows a recoverable load error when an adapter rejects without a message', async () => {
    render(
      <SettingsExample
        loadSettings={async () => {
          throw new Error('')
        }}
      />,
    )
    expect(await screen.findByRole('alert')).toHaveTextContent('Settings could not be loaded.')
    expect(screen.getByRole('button', { name: 'Try again' })).toBeEnabled()
  })
})
