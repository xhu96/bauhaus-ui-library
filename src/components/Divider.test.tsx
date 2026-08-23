import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Divider } from './Divider'

describe('Divider', () => {
  it('renders horizontal divider with default separator role', () => {
    render(<Divider />)

    const separator = screen.getByRole('separator')
    expect(separator).toBeInTheDocument()
    expect(separator).toHaveAttribute('aria-orientation', 'horizontal')
  })

  it('renders vertical divider with vertical orientation', () => {
    render(<Divider orientation="vertical" />)

    const separator = screen.getByRole('separator')
    expect(separator).toHaveAttribute('aria-orientation', 'vertical')
  })

  it('renders centered label for horizontal divider', () => {
    render(<Divider label="OR" />)

    expect(screen.getByText('OR')).toBeInTheDocument()
  })

  it('uses theme-aware CSS variable for ink color', () => {
    const { container } = render(<Divider color="ink" />)

    const sep = container.firstChild as HTMLElement
    expect(sep).toHaveStyle({ borderTopColor: 'rgb(var(--bui-ink))' })
  })
})
