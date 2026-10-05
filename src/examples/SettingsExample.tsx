import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { Alert } from '../components/Alert'
import { Button } from '../components/Button'
import { FormField } from '../components/FormField'
import { Input } from '../components/Input'
import { Modal, ModalBody, ModalFooter } from '../components/Modal'
import { Select } from '../components/Select'
import { Spinner } from '../components/Spinner'
import { Switch } from '../components/Switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/Tabs'
import { SettingsMembers } from './SettingsMembers'
import { defaultMembers, type WorkspaceMember, type WorkspaceSettings } from './settingsModel'
import { loadLocalSettings, saveLocalSettings } from './settingsService'
import '../styles/settings-example.css'

export interface SettingsExampleProps {
  loadSettings?: (signal: AbortSignal) => Promise<WorkspaceSettings>
  saveSettings?: (settings: WorkspaceSettings, signal: AbortSignal) => Promise<WorkspaceSettings>
  members?: WorkspaceMember[]
}

/** Preview composition. Adapters should honor AbortSignal and return the saved snapshot. */
export function SettingsExample({
  loadSettings = loadLocalSettings,
  saveSettings = saveLocalSettings,
  members = defaultMembers,
}: SettingsExampleProps) {
  const headingId = useId()
  const [draft, setDraft] = useState<WorkspaceSettings | null>(null)
  const [saved, setSaved] = useState<WorkspaceSettings | null>(null)
  const [loadError, setLoadError] = useState('')
  const [retry, setRetry] = useState(0)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({})
  const [tab, setTab] = useState('profile')
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('horizontal')
  const [discardOpen, setDiscardOpen] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const focusAfterDiscard = useRef(false)
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const saveRequest = useRef<AbortController | null>(null)
  const dirty = Boolean(
    draft &&
    saved &&
    (draft.name !== saved.name ||
      draft.email !== saved.email ||
      draft.notifications !== saved.notifications ||
      draft.digest !== saved.digest),
  )

  useEffect(() => {
    const request = new AbortController()
    saveRequest.current?.abort()
    saveRequest.current = null
    setSaving(false)
    setSaveError('')
    setErrors({})
    setMessage('')
    setDiscardOpen(false)
    setDraft(null)
    setSaved(null)
    setLoadError('')
    Promise.resolve()
      .then(() => loadSettings(request.signal))
      .then((value) => {
        if (!request.signal.aborted) {
          setDraft({ ...value })
          setSaved({ ...value })
        }
      })
      .catch((error) => {
        if (!request.signal.aborted)
          setLoadError(
            error instanceof Error && error.message.trim() ? error.message : 'Settings could not be loaded.',
          )
      })
    return () => request.abort()
  }, [loadSettings, retry])

  useEffect(() => () => saveRequest.current?.abort(), [])
  useEffect(() => {
    const media = window.matchMedia?.('(max-width: 760px)')
    if (!media) return
    const syncOrientation = () => setOrientation(media.matches ? 'horizontal' : 'vertical')
    syncOrientation()
    media.addEventListener('change', syncOrientation)
    return () => media.removeEventListener('change', syncOrientation)
  }, [])
  useEffect(() => {
    if (discardOpen || !focusAfterDiscard.current) return
    focusAfterDiscard.current = false
    sectionRef.current?.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]')?.focus()
  }, [discardOpen])
  useEffect(() => {
    if (tab === 'profile') {
      if (errors.name) nameRef.current?.focus()
      else if (errors.email) emailRef.current?.focus()
    }
  }, [errors.name, errors.email, tab])
  useEffect(() => {
    if (!dirty) return
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  function update<K extends keyof WorkspaceSettings>(key: K, value: WorkspaceSettings[K]) {
    setDraft((current) => (current ? { ...current, [key]: value } : current))
    setErrors({})
    setMessage('')
    setSaveError('')
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!draft || !dirty || saveRequest.current) return
    const snapshot = { ...draft, name: draft.name.trim(), email: draft.email.trim() }
    const validation = {
      name: snapshot.name ? undefined : 'Enter a workspace name.',
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(snapshot.email) ? undefined : 'Enter a valid email address.',
    }
    setErrors(validation)
    if (validation.name || validation.email) {
      setTab('profile')
      return
    }
    const request = new AbortController()
    saveRequest.current = request
    setSaving(true)
    setSaveError('')
    setMessage('')
    try {
      const result = await saveSettings(snapshot, request.signal)
      if (!request.signal.aborted) {
        setDraft({ ...result })
        setSaved({ ...result })
        setMessage('Changes saved.')
      }
    } catch (error) {
      if (!request.signal.aborted)
        setSaveError(
          error instanceof Error && error.message.trim()
            ? error.message
            : 'Changes could not be saved. Try again.',
        )
    } finally {
      if (!request.signal.aborted) setSaving(false)
      if (saveRequest.current === request) saveRequest.current = null
    }
  }

  function discard() {
    focusAfterDiscard.current = true
    setDraft(saved ? { ...saved } : null)
    setErrors({})
    setSaveError('')
    setMessage('Changes discarded.')
    setDiscardOpen(false)
  }

  return (
    <section ref={sectionRef} className="settings-example" aria-labelledby={headingId}>
      <header className="settings-heading">
        <div>
          <h1 id={headingId}>
            Workspace
            <br />
            settings
          </h1>
          <p>Manage your profile, notifications and team in one place.</p>
        </div>
        <div className="settings-composition" aria-hidden="true">
          <span className="settings-composition-circle" />
          <span className="settings-composition-triangle" />
          <span className="settings-composition-square" />
        </div>
      </header>
      {loadError ? (
        <div className="settings-load-state">
          <Alert status="danger" title="Unable to load settings">
            {loadError}
          </Alert>
          <Button intent="primary" onClick={() => setRetry((value) => value + 1)}>
            Try again
          </Button>
        </div>
      ) : !draft ? (
        <div className="settings-load-state">
          <Spinner label="Loading settings" />
          <p>Loading your workspace…</p>
          <div className="settings-skeleton" aria-hidden="true" />
        </div>
      ) : (
        <Tabs value={tab} onValueChange={setTab} orientation={orientation} className="settings-workspace">
          <TabsList className="settings-tabs" aria-label="Workspace settings sections">
            <TabsTrigger value="profile">
              <span className="settings-tab-number" aria-hidden="true">
                01
              </span>
              <span className="settings-tab-shape settings-tab-circle" aria-hidden="true" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <span className="settings-tab-number" aria-hidden="true">
                02
              </span>
              <span className="settings-tab-shape settings-tab-square" aria-hidden="true" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="team">
              <span className="settings-tab-number" aria-hidden="true">
                03
              </span>
              <span className="settings-tab-shape settings-tab-triangle" aria-hidden="true" />
              Team
            </TabsTrigger>
          </TabsList>
          <div className="settings-content">
            <form noValidate onSubmit={submit} aria-label="Workspace preferences">
              <fieldset disabled={saving} className="settings-fields">
                <TabsContent value="profile" keepMounted>
                  <section className="settings-panel">
                    <h2>
                      <span className="settings-section-number" aria-hidden="true">
                        01
                      </span>
                      Workspace profile
                    </h2>
                    <p className="settings-description">
                      Choose how your workspace appears and where we send account updates.
                    </p>
                    <FormField
                      label="Workspace name"
                      required
                      hint="Visible to everyone in your team."
                      error={errors.name}
                    >
                      <Input
                        ref={nameRef}
                        name="workspaceName"
                        autoComplete="organization"
                        value={draft.name}
                        onChange={(event) => update('name', event.target.value)}
                      />
                    </FormField>
                    <FormField
                      label="Contact email"
                      required
                      hint="Used for account and security updates."
                      error={errors.email}
                    >
                      <Input
                        ref={emailRef}
                        type="email"
                        name="contactEmail"
                        autoComplete="email"
                        value={draft.email}
                        onChange={(event) => update('email', event.target.value)}
                      />
                    </FormField>
                  </section>
                </TabsContent>
                <TabsContent value="notifications" keepMounted>
                  <section className="settings-panel">
                    <h2>
                      <span className="settings-section-number" aria-hidden="true">
                        02
                      </span>
                      Stay in the loop
                    </h2>
                    <p className="settings-description">
                      Choose when you hear about activity in your workspace.
                    </p>
                    <div className="settings-toggle-row">
                      <div>
                        <strong>Email notifications</strong>
                        <p>Receive a summary of team activity.</p>
                      </div>
                      <FormField label="Email notifications" className="settings-switch-label">
                        <Switch
                          checked={draft.notifications}
                          onCheckedChange={(value) => update('notifications', value)}
                        />
                      </FormField>
                    </div>
                    <FormField label="Digest frequency" hint="You can change this whenever you like.">
                      <Select
                        value={draft.digest}
                        disabled={!draft.notifications || saving}
                        onChange={(event) =>
                          update('digest', event.target.value as WorkspaceSettings['digest'])
                        }
                        options={[
                          { value: 'daily', label: 'Daily summary' },
                          { value: 'weekly', label: 'Weekly summary' },
                        ]}
                      />
                    </FormField>
                  </section>
                </TabsContent>
              </fieldset>
              {tab !== 'team' && (
                <footer className="settings-save-area">
                  {saveError && (
                    <Alert status="danger" title="Your changes are still here">
                      {saveError}
                    </Alert>
                  )}
                  <div className="settings-save-bar">
                    <div>
                      <p className="settings-dirty" aria-live="polite">
                        {saving
                          ? 'Saving your changes…'
                          : dirty
                            ? 'You have unsaved changes.'
                            : 'Everything is up to date.'}
                      </p>
                      <p role="status" aria-label="Save status" className="settings-save-status">
                        {message}
                      </p>
                    </div>
                    <div className="settings-actions">
                      <Button
                        intent="secondary"
                        disabled={!dirty || saving}
                        onClick={() => setDiscardOpen(true)}
                      >
                        Discard changes
                      </Button>
                      <Button intent="primary" type="submit" disabled={!dirty} isLoading={saving}>
                        {saving ? 'Saving changes' : 'Save changes'}
                      </Button>
                    </div>
                  </div>
                </footer>
              )}
            </form>
            <TabsContent value="team" keepMounted>
              <SettingsMembers members={members} />
            </TabsContent>
            {tab === 'team' && (saving || saveError || message) && (
              <div className="settings-save-area">
                {saveError && (
                  <Alert status="danger" title="Your changes are still here">
                    {saveError}
                  </Alert>
                )}
                <p role="status" aria-label="Save status" className="settings-save-status">
                  {saving ? 'Saving your changes…' : message}
                </p>
              </div>
            )}
          </div>
        </Tabs>
      )}
      <Modal open={discardOpen} onClose={() => setDiscardOpen(false)} title="Discard unsaved changes?">
        <ModalBody>
          Your workspace will return to its last saved settings. Your unsaved edits will be lost.
        </ModalBody>
        <ModalFooter>
          <Button intent="secondary" onClick={() => setDiscardOpen(false)}>
            Keep editing
          </Button>
          <Button intent="destructive" onClick={discard}>
            Discard changes
          </Button>
        </ModalFooter>
      </Modal>
    </section>
  )
}
