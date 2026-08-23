import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
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

  it('triggers onPageChange when clicking numbered page and prev/next controls', async () => {
    const user = userEvent.setup()
    const handlePageChange = vi.fn()
    render(<Pagination page={2} count={5} onPageChange={handlePageChange} />)

    await user.click(screen.getByRole('button', { name: 'Go to page 4' }))
    expect(handlePageChange).toHaveBeenCalledWith(4)

    await user.click(screen.getByRole('button', { name: 'Go to previous page' }))
    expect(handlePageChange).toHaveBeenCalledWith(1)

    await user.click(screen.getByRole('button', { name: 'Go to next page' }))
    expect(handlePageChange).toHaveBeenCalledWith(3)
  })

  it('disables previous button on first page and next button on last page', () => {
    const { rerender } = render(<Pagination page={1} count={5} onPageChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'Go to previous page' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Go to next page' })).not.toBeDisabled()

    rerender(<Pagination page={5} count={5} onPageChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'Go to previous page' })).not.toBeDisabled()
    expect(screen.getByRole('button', { name: 'Go to next page' })).toBeDisabled()
  })
})
