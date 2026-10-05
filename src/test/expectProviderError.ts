import { expect, vi } from 'vitest'

/** Capture only this render's known provider error and React's matching report. */
export function expectProviderError(render: () => unknown, message: string, component: string) {
  const events: ErrorEvent[] = []
  const reports: Error[] = []
  const componentReports: string[] = []
  const originalError = console.error
  const prefix = `The above error occurred in the <${component}> component:\n`
  const suffix =
    '\n\nConsider adding an error boundary to your tree to customize error handling behavior.\n' +
    'Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.'
  const onError = (event: ErrorEvent) => {
    if (event.error instanceof Error && event.error.message === message && event.message === message) {
      events.push(event)
      event.preventDefault()
    }
  }
  window.addEventListener('error', onError)
  const spy = vi.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
    const report = args[0]
    // Concurrent recovery creates a fresh Error; assert its identity against the
    // final thrown value below, in addition to this exact message match.
    if (events.length && args.length === 1 && report instanceof Error && report.message === message) {
      reports.push(report)
      return
    }
    if (
      events.length &&
      args.length === 1 &&
      typeof report === 'string' &&
      report.startsWith(prefix) &&
      report.endsWith(suffix) &&
      /^(\n {4}at [^\n]+)+$/.test(report.slice(prefix.length, -suffix.length))
    ) {
      componentReports.push(report)
      return
    }
    originalError(...args)
  })
  try {
    let thrown: unknown
    try {
      render()
    } catch (error) {
      thrown = error
    }
    expect(thrown).toBeInstanceOf(Error)
    expect((thrown as Error).message).toBe(message)
    // React 18 retries a failed render, producing two exact error events.
    expect(events).toHaveLength(2)
    for (const event of events) {
      expect(event.error.message).toBe(message)
      expect(event.defaultPrevented).toBe(true)
    }
    expect(reports).toHaveLength(1)
    expect(reports[0]).toBe(thrown)
    expect(componentReports).toHaveLength(1)
  } finally {
    spy.mockRestore()
    window.removeEventListener('error', onError)
  }
}
