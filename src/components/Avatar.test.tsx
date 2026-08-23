import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Avatar } from './Avatar'

describe('Avatar', () => {
  it('renders image when src is provided', () => {
    render(<Avatar src="https://example.com/user.jpg" name="Alice Smith" />)

    const img = screen.getByRole('img', { name: 'Alice Smith' })
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'https://example.com/user.jpg')
    expect(img).toHaveAttribute('alt', 'Alice Smith')
  })

  it('renders two-letter initials for multi-word name', () => {
    render(<Avatar name="Walter Gropius" />)

    expect(screen.getByText('WG')).toBeInTheDocument()
  })

  it('renders first two characters for single-word name', () => {
    render(<Avatar name="Bauhaus" />)

    expect(screen.getByText('BA')).toBeInTheDocument()
  })

  it('renders question mark when name is empty or missing', () => {
    render(<Avatar />)

    expect(screen.getByText('?')).toBeInTheDocument()
  })

  it('supports circle shape and custom sizes', () => {
    const { container } = render(<Avatar name="Paul Klee" shape="circle" size="lg" />)

    const avatar = container.querySelector('span[role="img"]')
    expect(avatar).toHaveClass('bui-rounded-full')
    expect(avatar).toHaveStyle({ width: '60px', height: '60px' })
  })
})
