import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ShapeLogo } from './ShapeLogo'

describe('ShapeLogo', () => {
  it('renders the default mark with the complete Bauhaus color set', () => {
    const { container } = render(<ShapeLogo label="Bauhaus UI" />)
    const shapes = container.querySelectorAll('svg')

    expect(shapes).toHaveLength(4)
    expect(shapes[0]).toHaveClass('text-ink')
    expect(shapes[1]).toHaveClass('text-bred')
    expect(shapes[2]).toHaveClass('text-bblue')
    expect(shapes[3]).toHaveClass('text-byellow')
    const crossBars = shapes[3].querySelectorAll('rect')
    expect(crossBars).toHaveLength(2)
    expect(crossBars[0]).toHaveAttribute('x', '42')
    expect(crossBars[0]).toHaveAttribute('y', '4')
    expect(crossBars[1]).toHaveAttribute('x', '4')
    expect(crossBars[1]).toHaveAttribute('y', '42')
  })
})
