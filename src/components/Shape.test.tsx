import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Shape, type ShapeKind } from './Shape'

describe('Shape', () => {
  const allShapes: ShapeKind[] = [
    'circle',
    'square',
    'triangle',
    'semicircle',
    'quarter',
    'ring',
    'diamond',
    'cross',
    'arc',
  ]

  it.each(allShapes)('renders %s shape successfully', (kind) => {
    const { container } = render(<Shape kind={kind} color="blue" size={48} />)
    const svg = container.querySelector('svg')

    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('width', '48')
    expect(svg).toHaveAttribute('height', '48')
    expect(svg).toHaveClass('bui-text-bblue')
  })

  it('renders outline mode with no solid fill', () => {
    const { container } = render(<Shape kind="circle" outline />)
    const circle = container.querySelector('circle')

    expect(circle).toHaveAttribute('fill', 'none')
    expect(circle).toHaveAttribute('stroke', 'currentColor')
  })
})
