export async function copyText(text: string): Promise<void> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return
    }
  } catch {
    // Fall through to the legacy selection path when browser permissions block the async API.
  }

  if (typeof document.execCommand !== 'function') {
    throw new Error('Clipboard API is unavailable')
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.left = '-9999px'
  textarea.style.top = '0'
  document.body.append(textarea)

  textarea.select()
  textarea.setSelectionRange(0, textarea.value.length)

  try {
    if (!document.execCommand('copy')) {
      throw new Error('Clipboard API is unavailable')
    }
  } finally {
    textarea.remove()
  }
}
