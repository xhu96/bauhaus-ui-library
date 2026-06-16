import { afterEach, describe, expect, it, vi } from 'vitest'
import { copyText } from './clipboard'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  Reflect.deleteProperty(document, 'execCommand')
})

describe('copyText', () => {
  it('writes the requested text to the Clipboard API', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })

    await copyText('npm install bauhaus-ui-library')

    expect(writeText).toHaveBeenCalledWith('npm install bauhaus-ui-library')
  })

  it('rejects when Clipboard API support is absent', async () => {
    vi.stubGlobal('navigator', {})

    await expect(copyText('command')).rejects.toThrow('Clipboard API is unavailable')
  })

  it('falls back to a temporary selection when Clipboard API write fails', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('denied'))
    const execCommand = vi.fn().mockReturnValue(true)
    vi.stubGlobal('navigator', { clipboard: { writeText } })
    Object.defineProperty(document, 'execCommand', {
      configurable: true,
      value: execCommand,
    })

    await copyText('npm install bauhaus-ui-library')

    expect(writeText).toHaveBeenCalledWith('npm install bauhaus-ui-library')
    expect(execCommand).toHaveBeenCalledWith('copy')
    expect(document.querySelector('textarea')).not.toBeInTheDocument()
  })
})
