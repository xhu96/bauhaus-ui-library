import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import geometricPatternSource from './GeometricPattern.tsx?raw'
import { Shape, type ShapeKind } from './Shape'

function renderShape(kind: ShapeKind) {
  const { container } = render(<Shape kind={kind} size={100} />)
  const svg = container.querySelector('svg')
  expect(svg).toBeInTheDocument()
  return svg as SVGSVGElement
}

describe('geometric icon alignment', () => {
  it('uses a shared 4px optical inset for primitive shape edges', () => {
    const square = renderShape('square').querySelector('rect')
    expect(square).toHaveAttribute('x', '4')
    expect(square).toHaveAttribute('y', '4')
    expect(square).toHaveAttribute('width', '92')
    expect(square).toHaveAttribute('height', '92')

    const triangle = renderShape('triangle').querySelector('polygon')
    expect(triangle).toHaveAttribute('points', '50,4 96,96 4,96')

    const ring = renderShape('ring').querySelector('circle')
    expect(ring).toHaveAttribute('r', '39')
    expect(ring).toHaveAttribute('stroke-width', '14')

    const crossRects = renderShape('cross').querySelectorAll('rect')
    expect(crossRects[0]).toHaveAttribute('x', '42')
    expect(crossRects[0]).toHaveAttribute('y', '4')
    expect(crossRects[0]).toHaveAttribute('width', '16')
    expect(crossRects[0]).toHaveAttribute('height', '92')
    expect(crossRects[1]).toHaveAttribute('x', '4')
    expect(crossRects[1]).toHaveAttribute('y', '42')
    expect(crossRects[1]).toHaveAttribute('width', '92')
    expect(crossRects[1]).toHaveAttribute('height', '16')
  })

  it('keeps generated pattern motifs on the same 4px tile grid', () => {
    expect(geometricPatternSource).toContain('const TILE_EDGE = 4')
    expect(geometricPatternSource).not.toContain('points="0,0 100,0 0,100"')
    expect(geometricPatternSource).not.toContain('M0 0 A100 100')
    expect(geometricPatternSource).not.toContain('r="38"')
    expect(geometricPatternSource).not.toContain('x="8"')
    expect(geometricPatternSource).not.toContain('y="8"')
    expect(geometricPatternSource).not.toContain('width="84"')
    expect(geometricPatternSource).not.toContain('height="84"')
  })
})
