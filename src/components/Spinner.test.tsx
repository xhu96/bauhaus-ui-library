import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Spinner } from './Spinner'

describe('Spinner', () => {
  it('renders with accessible status role and label', () => {
    render(<Spinner label="Processing payment" />)

    const status = screen.getByRole('status', { name: 'Processing payment' })
    expect(status).toBeInTheDocument()
    expect(screen.getByText('Processing payment')).toHaveClass('bui-sr-only')
  })

  it('renders a single Bauhaus three-quarter ring with square-cut ends', () => {
    const { container } = render(<Spinner />)

    const svg = container.querySelector('svg')
    const circle = svg?.querySelector('circle')

    expect(svg).toHaveClass('bui-animate-spin', 'bui-origin-center')
    expect(circle).toHaveAttribute('stroke-linecap', 'square')
    expect(circle).toHaveAttribute('pathLength', '100')
    expect(circle).toHaveAttribute('stroke-dasharray', '72 28')
    expect(svg?.querySelector('path')).not.toBeInTheDocument()
    expect(svg?.querySelector('rect')).not.toBeInTheDocument()
  })

  it('renders ink color with currentColor and text-ink class for theme awareness', () => {
    const { container } = render(<Spinner color="ink" />)

    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('bui-text-ink')
    const circle = svg?.querySelector('circle')
    expect(circle).toHaveAttribute('stroke', 'currentColor')
  })

  it('renders custom color hex when non-ink color is specified', () => {
    const { container } = render(<Spinner color="red" />)

    const circle = container.querySelector('circle')
    expect(circle).toHaveAttribute('stroke', '#E63329')
  })

  it('can render decoratively without adding an accessible loading label', () => {
    const { container } = render(<Spinner decorative label="Hidden loading label" />)

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.queryByText('Hidden loading label')).not.toBeInTheDocument()
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })
})
