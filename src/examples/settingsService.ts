import { defaultSettings, type WorkspaceSettings } from './settingsModel'

const storageKey = 'bauhaus-settings-example-v1'

function wait(signal: AbortSignal, milliseconds: number) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException('Aborted', 'AbortError'))
      return
    }
    const abort = () => {
      clearTimeout(timer)
      reject(new DOMException('Aborted', 'AbortError'))
    }
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', abort)
      resolve()
    }, milliseconds)
    signal.addEventListener('abort', abort, { once: true })
  })
}

/** Local preview adapter. Replace with an API adapter in a consumer application. */
export async function loadLocalSettings(signal: AbortSignal): Promise<WorkspaceSettings> {
  await wait(signal, 250)
  try {
    const value = JSON.parse(window.localStorage.getItem(storageKey) ?? 'null') as WorkspaceSettings | null
    if (
      value &&
      typeof value.name === 'string' &&
      typeof value.email === 'string' &&
      typeof value.notifications === 'boolean' &&
      (value.digest === 'daily' || value.digest === 'weekly')
    ) {
      return {
        name: value.name,
        email: value.email,
        notifications: value.notifications,
        digest: value.digest,
      }
    }
  } catch {
    /* A fresh example remains usable when storage is missing or unreadable. */
  }
  return { ...defaultSettings }
}

export async function saveLocalSettings(
  settings: WorkspaceSettings,
  signal: AbortSignal,
): Promise<WorkspaceSettings> {
  await wait(signal, 650)
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(settings))
  } catch {
    throw new Error('Changes could not be saved in this browser. Check storage permissions and try again.')
  }
  return { ...settings }
}
