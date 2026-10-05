import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { GeometricPattern } from './GeometricPattern'

describe('GeometricPattern', () => {
  it.each([NaN, Infinity, -Infinity])('renders no cells for nonfinite dimensions (%s)', (value) => {
    const { container, rerender } = render(<GeometricPattern rows={value} cols={1} />)
    expect(container.querySelectorAll('svg')).toHaveLength(0)
    rerender(<GeometricPattern rows={1} cols={value} />)
    expect(container.querySelectorAll('svg')).toHaveLength(0)
    expect(container.firstChild).toHaveStyle({ gridTemplateColumns: 'none' })
  })
  it('bounds huge finite dimensions and produces deterministic empty-array fallbacks', () => {
    const { container, rerender } = render(
      <GeometricPattern rows={Number.MAX_VALUE} cols={Number.MAX_VALUE} palette={[]} surfaces={[]} />,
    )
    expect(container.querySelectorAll('svg')).toHaveLength(4096)
    expect(container.firstChild).toHaveStyle({ gridTemplateColumns: 'repeat(4096, 1fr)' })
    const markup = container.innerHTML
    rerender(<GeometricPattern rows={Number.MAX_VALUE} cols={Number.MAX_VALUE} palette={[]} surfaces={[]} />)
    expect(container.innerHTML).toBe(markup)
  })
  it('uses valid fallback colors for empty palette and surfaces', () => {
    const { container } = render(<GeometricPattern rows={1} cols={1} palette={[]} surfaces={[]} />)
    expect(container.querySelector('svg > rect')).toHaveAttribute('fill')
    expect(container.innerHTML).not.toContain('undefined')
  })

  it('floors fractional dimensions and gives negative dimensions no cells', () => {
    const { container, rerender } = render(<GeometricPattern rows={2.8} cols={3.2} />)
    expect(container.querySelectorAll('svg')).toHaveLength(6)
    expect(container.firstChild).toHaveStyle({ gridTemplateColumns: 'repeat(3, 1fr)' })
    rerender(<GeometricPattern rows={-1} cols={-2} />)
    expect(container.querySelectorAll('svg')).toHaveLength(0)
    expect(container.firstChild).toHaveStyle({ gridTemplateColumns: 'none' })
  })

  it('caps large grids at 4096 cells', () => {
    const { container } = render(<GeometricPattern rows={65} cols={65} />)
    expect(container.querySelectorAll('svg').length).toBeLessThanOrEqual(4096)
  })

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
