import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Badge } from './Badge'

describe('Badge', () => {
  it('renders solid badge with default props', () => {
    render(<Badge>New</Badge>)

    const badge = screen.getByText('New')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('bui-font-display', 'bui-uppercase')
  })

  it('renders outline variant and color classes', () => {
    render(
      <Badge variant="outline" color="red">
        Beta
      </Badge>,
    )

    const badge = screen.getByText('Beta')
    expect(badge).toHaveClass('bui-bg-transparent', 'bui-text-bred-ink')
  })

  it('applies correct size classes', () => {
    const { rerender } = render(<Badge size="sm">Small</Badge>)
    expect(screen.getByText('Small')).toHaveClass('bui-h-5')

    rerender(<Badge size="lg">Large</Badge>)
    expect(screen.getByText('Large')).toHaveClass('bui-h-7')
  })
})
