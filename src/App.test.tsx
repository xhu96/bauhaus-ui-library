import { act, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App'

afterEach(() => {
  document.documentElement.classList.remove('dark')
  document.documentElement.removeAttribute('data-bui-theme')
  window.localStorage.clear()
  vi.useRealTimers()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('hero artwork sequence', () => {
  it('alternates the mascot and geometric board, and preserves the current artwork and focus when paused', () => {
    vi.useFakeTimers()
    const { container } = render(<App />)
    const artwork = container.querySelector('.landing-hero-art')!
    expect(artwork).toHaveAttribute('data-artwork', 'mascot')
    expect(artwork.querySelector('.hb .board')?.children).toHaveLength(20)
    expect(artwork.querySelector('.landing-hero-strip')?.children).toHaveLength(14)

    act(() => vi.advanceTimersByTime(8000))
    expect(artwork).toHaveAttribute('data-artwork', 'geometry')
    const pause = screen.getByRole('button', { name: 'Pause or resume hero animation' })
    pause.focus()
    fireEvent.click(pause)
    act(() => vi.advanceTimersByTime(16000))
    expect(artwork).toHaveAttribute('data-artwork', 'geometry')
    const resume = screen.getByRole('button', { name: 'Pause or resume hero animation' })
    expect(resume).toHaveAttribute('aria-pressed', 'true')
    expect(resume).toHaveFocus()
    fireEvent.click(resume)
    act(() => vi.advanceTimersByTime(8000))
    expect(artwork).toHaveAttribute('data-artwork', 'mascot')
    expect(screen.getByRole('button', { name: 'Pause or resume hero animation' })).toHaveFocus()
    fireEvent.click(screen.getByRole('button', { name: 'Switch hero artwork' }))
    expect(artwork).toHaveAttribute('data-artwork', 'geometry')
    expect(resume).toHaveAttribute('aria-pressed', 'true')
    act(() => vi.advanceTimersByTime(16000))
    expect(artwork).toHaveAttribute('data-artwork', 'geometry')
  })

  it('starts with stable artwork for reduced motion and offers an explicit manual switch', () => {
    vi.useFakeTimers()
    vi.stubGlobal('matchMedia', () => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))
    const { container } = render(<App />)
    const artwork = container.querySelector('.landing-hero-art')!
    expect(screen.getByRole('button', { name: 'Pause or resume hero animation' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    act(() => vi.advanceTimersByTime(16000))
    expect(artwork).toHaveAttribute('data-artwork', 'mascot')
    fireEvent.click(screen.getByRole('button', { name: 'Switch hero artwork' }))
    expect(artwork).toHaveAttribute('data-artwork', 'geometry')
    act(() => vi.advanceTimersByTime(16000))
    expect(artwork).toHaveAttribute('data-artwork', 'geometry')
    expect(artwork.querySelectorAll('.landing-hero-phase[aria-hidden="true"]')).toHaveLength(2)
  })

  it('suspends automatic cycling while the page is hidden', () => {
    vi.useFakeTimers()
    const { container } = render(<App />)
    const artwork = container.querySelector('.landing-hero-art')!
    const hidden = vi.spyOn(document, 'hidden', 'get').mockReturnValue(true)
    fireEvent(document, new Event('visibilitychange'))
    act(() => vi.advanceTimersByTime(16000))
    expect(artwork).toHaveAttribute('data-artwork', 'mascot')
    hidden.mockReturnValue(false)
    fireEvent(document, new Event('visibilitychange'))
    act(() => vi.advanceTimersByTime(8000))
    expect(artwork).toHaveAttribute('data-artwork', 'geometry')
  })
})

describe('landing discovery and demos', () => {
  it('persists a named selection using the existing preference key', async () => {
    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: 'Dark' }))
    expect(window.localStorage.getItem('bauhaus-theme')).toBe('dark')
    await userEvent.click(screen.getByRole('button', { name: 'Light' }))
    expect(window.localStorage.getItem('bauhaus-theme')).toBe('light')
  })
  it('selects exactly the named theme repeatedly, even when storage fails', async () => {
    const user = userEvent.setup()
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    render(<App />)
    for (const name of ['Dark', 'Dark', 'Light', 'Light']) {
      await user.click(screen.getByRole('button', { name }))
      expect(document.documentElement).toHaveAttribute('data-bui-theme', name.toLowerCase())
      expect(document.documentElement.classList.contains('dark')).toBe(name === 'Dark')
    }
  })

  it('searches the complete documented catalog and exposes real docs links', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Search components' }))
    await user.type(screen.getByRole('textbox', { name: 'Search all components' }), 'Checkbox')
    expect(screen.getByRole('link', { name: 'Checkbox' })).toHaveAttribute(
      'href',
      './storybook/?path=/docs/form-checkbox--docs',
    )
    expect(screen.queryByText(/No preview matches/)).not.toBeInTheDocument()
  })

  it('keeps component discovery available from mobile navigation', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Toggle navigation' }))
    await user.click(
      within(screen.getByRole('navigation', { name: 'Primary navigation' })).getByRole('button', {
        name: 'Search all components',
      }),
    )
    expect(screen.getByRole('textbox', { name: 'Search all components' })).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('textbox', { name: 'Search all components' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Toggle navigation' })).toHaveFocus()
  })

  it('returns focus to search after Escape or Close search', async () => {
    const user = userEvent.setup()
    render(<App />)
    const trigger = screen.getByRole('button', { name: 'Search components' })
    await user.click(trigger)
    await user.keyboard('{Escape}')
    expect(trigger).toHaveFocus()
    await user.click(trigger)
    await user.click(screen.getByRole('button', { name: 'Close search' }))
    expect(trigger).toHaveFocus()
  })

  it('opens an actual modal whose Cancel dismisses it', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Open dialog' }))
    const dialog = await screen.findByRole('dialog', { name: 'Confirm changes' })
    await user.click(within(dialog).getByRole('button', { name: 'Cancel' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('distinguishes this unpublished preview from the npm install', () => {
    render(<App />)
    expect(screen.getByText(/0.2.0dev2 is unpublished/)).toBeInTheDocument()
    expect(screen.getAllByText(/npm install bauhaus-ui-library@0.1.1/).length).toBeGreaterThan(0)
    expect(screen.getByRole('link', { name: 'Examples' })).toHaveAttribute(
      'href',
      './storybook/?path=/docs/examples-onboarding--docs',
    )
  })
})

describe('landing page release messaging', () => {
  it('shows the current version without claiming a stable release', () => {
    render(<App />)

    expect(screen.getByRole('link', { name: 'v0.2.0dev2' })).toBeInTheDocument()
    expect(screen.queryByText(/stable release/i)).not.toBeInTheDocument()
  })

  it('keeps Issues available without publishing a Discussions entry point', () => {
    render(<App />)

    expect(screen.getByRole('link', { name: 'Issues' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Discussions' })).not.toBeInTheDocument()
  })

  it('keeps the first two landing dogs smiling and the running dog neutral', () => {
    const { container } = render(<App />)

    expect(
      [...container.querySelectorAll('[data-bui-mascot]')].map((mascot) =>
        mascot.getAttribute('data-bui-mascot'),
      ),
    ).toEqual(['hero-study', 'install-study', 'running-study'])
    expect(container.querySelectorAll('[data-part="smile"]')).toHaveLength(2)
    const runningDog = container.querySelector('[data-bui-mascot="running-study"]')!
    expect(runningDog.querySelector('[data-part="head"]')).toHaveAttribute('data-expression', 'neutral')
    expect(runningDog.querySelector('[data-part="smile"]')).not.toBeInTheDocument()
    expect(runningDog.querySelector('[data-part="closed-mouth"]')).toBeInTheDocument()
    expect(container.querySelector('img[src*="mascot"]')).not.toBeInTheDocument()
  })
})
