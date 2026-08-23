import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('landing page release messaging', () => {
  it('shows the current version without claiming a stable release', () => {
    render(<App />)

    expect(screen.getByRole('link', { name: 'v0.2.0dev' })).toBeInTheDocument()
    expect(screen.queryByText(/stable release/i)).not.toBeInTheDocument()
  })

  it('keeps Issues available without publishing a Discussions entry point', () => {
    render(<App />)

    expect(screen.getByRole('link', { name: 'Issues' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Discussions' })).not.toBeInTheDocument()
  })

  it('renders every landing mascot from the shared React SVG component', () => {
    const { container } = render(<App />)

    expect(
      [...container.querySelectorAll('[data-bui-mascot]')].map((mascot) =>
        mascot.getAttribute('data-bui-mascot'),
      ),
    ).toEqual(['standing', 'working', 'running'])
    expect(container.querySelector('img[src*="mascot"]')).not.toBeInTheDocument()
  })
})
