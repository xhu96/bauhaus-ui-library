import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Progress } from './Progress'
import { createRef } from 'react'

describe('Progress', () => {
  it('forwards the ref and semantic props to one named progressbar', () => {
    const ref = createRef<HTMLDivElement>()
    render(
      <>
        <p id="description">Uploading files</p>
        <Progress
          ref={ref}
          id="upload"
          aria-label="Upload"
          aria-describedby="description"
          aria-valuetext="Halfway"
          role="progressbar"
          value={50}
        />
      </>,
    )
    const bar = screen.getByRole('progressbar', { name: 'Upload' })
    expect(screen.getAllByRole('progressbar')).toHaveLength(1)
    expect(bar).toHaveAccessibleDescription('Uploading files')
    expect(bar).toHaveAttribute('aria-valuetext', 'Halfway')
    expect(bar.id).toBe('upload')
    expect(ref.current).toBe(bar)
  })

  it.each([NaN, Infinity, -Infinity])('normalizes nonfinite values (%s) to zero', (value) => {
    render(<Progress value={value} showLabel />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')
    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('protects indeterminate and numeric semantics from conflicting ARIA props', () => {
    render(<Progress indeterminate aria-valuenow={90} aria-valuemin={-20} aria-valuemax={500} />)
    const bar = screen.getByRole('progressbar')
    expect(bar).not.toHaveAttribute('aria-valuenow')
    expect(bar).toHaveAttribute('aria-valuemin', '0')
    expect(bar).toHaveAttribute('aria-valuemax', '100')
  })

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
