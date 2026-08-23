import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { GeometricPattern } from './GeometricPattern'

describe('GeometricPattern', () => {
  it('renders a grid of SVG tiles matching requested rows and columns', () => {
    const { container } = render(<GeometricPattern rows={3} cols={4} seed={42} />)

    const svgs = container.querySelectorAll('svg')
    expect(svgs).toHaveLength(12)
  })

  it('renders deterministically with identical seeds', () => {
    const { container: first } = render(<GeometricPattern rows={2} cols={2} seed={123} />)
    const { container: second } = render(<GeometricPattern rows={2} cols={2} seed={123} />)

    expect(first.innerHTML).toBe(second.innerHTML)
  })

  it('renders thin grid lines when bordered is true', () => {
    const { container } = render(<GeometricPattern rows={1} cols={1} bordered={true} />)

    const borderRect = container.querySelector('rect[vector-effect="non-scaling-stroke"]')
    expect(borderRect).toBeInTheDocument()
  })

  it('merges caller-provided style without overwriting gridTemplateColumns', () => {
    const { container } = render(<GeometricPattern cols={6} style={{ opacity: 0.5 }} />)

    const grid = container.firstChild as HTMLElement
    expect(grid).toHaveStyle({
      gridTemplateColumns: 'repeat(6, 1fr)',
      opacity: '0.5',
    })
  })
})
