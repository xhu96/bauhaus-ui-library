import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Progress } from './Progress'

describe('Progress', () => {
  it('renders determinate progress bar with clamped value', () => {
    render(<Progress value={75} showLabel />)

    const progressbar = screen.getByRole('progressbar')
    expect(progressbar).toHaveAttribute('aria-valuenow', '75')
    expect(progressbar).toHaveAttribute('aria-valuemin', '0')
    expect(progressbar).toHaveAttribute('aria-valuemax', '100')
    expect(screen.getByText('75%')).toBeInTheDocument()
  })

  it('clamps values below 0 and above 100', () => {
    const { rerender } = render(<Progress value={-20} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')

    rerender(<Progress value={150} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
  })

  it('renders indeterminate animation without aria-valuenow', () => {
    render(<Progress indeterminate />)

    const progressbar = screen.getByRole('progressbar')
    expect(progressbar).not.toHaveAttribute('aria-valuenow')
    expect(progressbar.querySelector('.bui-animate-indeterminate')).toBeInTheDocument()
  })
})
