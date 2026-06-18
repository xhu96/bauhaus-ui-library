import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Pagination } from './Pagination'

describe('Pagination', () => {
  it('keeps first, current, last, previous, and next visible on mobile', () => {
    render(<Pagination page={3} count={10} onPageChange={() => {}} />)

    expect(screen.getByRole('button', { name: 'Go to page 1' })).not.toHaveAttribute('data-mobile-hidden')
    expect(screen.getByRole('button', { name: 'Go to page 3' })).not.toHaveAttribute('data-mobile-hidden')
    expect(screen.getByRole('button', { name: 'Go to page 10' })).not.toHaveAttribute('data-mobile-hidden')
    expect(screen.getByRole('button', { name: 'Go to page 2' })).toHaveAttribute('data-mobile-hidden', 'true')
    expect(screen.getByRole('button', { name: 'Go to page 4' })).toHaveAttribute('data-mobile-hidden', 'true')
  })
})
