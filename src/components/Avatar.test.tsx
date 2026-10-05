import { fireEvent, render, screen } from '@testing-library/react'
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

  it('replaces a failed image with named initials', () => {
    render(<Avatar src="/missing.jpg" name="Alice Smith" color="yellow" />)

    fireEvent.error(screen.getByRole('img', { name: 'Alice Smith' }))

    const fallback = screen.getByRole('img', { name: 'Alice Smith' })
    expect(fallback.tagName).toBe('SPAN')
    expect(fallback).toHaveTextContent('AS')
    expect(fallback.querySelector('img')).toBeNull()
  })

  it('gives the failed image fallback an accessible name when name is missing', () => {
    const { container } = render(<Avatar src="/missing.jpg" />)

    fireEvent.error(container.querySelector('img')!)

    expect(screen.getByRole('img', { name: 'avatar' })).toHaveTextContent('?')
  })

  it('retries when src changes, including a previously failed src', () => {
    const { rerender } = render(<Avatar src="/first.jpg" name="Alice Smith" />)
    fireEvent.error(screen.getByRole('img', { name: 'Alice Smith' }))
    expect(screen.getByText('AS')).toBeInTheDocument()

    rerender(<Avatar src="/second.jpg" name="Alice Smith" />)
    expect(screen.getByRole('img', { name: 'Alice Smith' })).toHaveAttribute('src', '/second.jpg')
    expect(screen.queryByText('AS')).not.toBeInTheDocument()

    rerender(<Avatar src="/first.jpg" name="Alice Smith" />)
    expect(screen.getByRole('img', { name: 'Alice Smith' })).toHaveAttribute('src', '/first.jpg')
    fireEvent.error(screen.getByRole('img', { name: 'Alice Smith' }))
    expect(screen.getByText('AS')).toBeInTheDocument()
  })

  it('ignores errors from an image replaced by a newer src', () => {
    const { rerender } = render(<Avatar src="/first.jpg" name="Alice Smith" />)
    const previousImage = screen.getByRole('img', { name: 'Alice Smith' })

    rerender(<Avatar src="/second.jpg" name="Alice Smith" />)
    fireEvent.error(previousImage)

    expect(screen.getByRole('img', { name: 'Alice Smith' })).toHaveAttribute('src', '/second.jpg')
    expect(screen.queryByText('AS')).not.toBeInTheDocument()
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
