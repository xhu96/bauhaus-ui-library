import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BauhausMascot } from './BauhausMascot'

describe('BauhausMascot', () => {
  it('is decorative by default and exposes a label when requested', () => {
    const { rerender } = render(<BauhausMascot />)
    expect(document.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')

    rerender(<BauhausMascot label="Bauhaus dog" />)
    expect(screen.getByRole('img', { name: 'Bauhaus dog' })).toBeInTheDocument()
  })

  it('uses exactly the same head geometry in every pose', () => {
    const { container } = render(
      <>
        <BauhausMascot pose="standing" />
        <BauhausMascot pose="working" />
        <BauhausMascot pose="running" />
      </>,
    )

    const heads = [...container.querySelectorAll('[data-part="head-unit"]')]
    expect(heads).toHaveLength(3)
    expect(heads[1].innerHTML).toBe(heads[0].innerHTML)
    expect(heads[2].innerHTML).toBe(heads[0].innerHTML)
  })

  it('only includes the pose composition when scene is enabled', () => {
    const { container, rerender } = render(<BauhausMascot pose="working" />)
    expect(container.querySelector('[data-part="scene"]')).not.toBeInTheDocument()

    rerender(<BauhausMascot pose="working" scene />)
    expect(container.querySelector('[data-part="scene"]')).toBeInTheDocument()
  })

  it('builds the standing body from a chest, short bridge, haunch, four legs, and tail', () => {
    const { container } = render(<BauhausMascot pose="standing" />)

    expect(container.querySelector('[data-part="chest"]')).toBeInTheDocument()
    expect(container.querySelector('[data-part="body-bridge"]')).toBeInTheDocument()
    expect(container.querySelector('[data-part="haunch"]')).toBeInTheDocument()
    expect(container.querySelectorAll('[data-part^="leg-"]')).toHaveLength(4)
    expect(container.querySelector('[data-part="tail"]')).toBeInTheDocument()
  })

  it('renders portraits with expression state without changing the mascot head', () => {
    const { container } = render(<BauhausMascot variant="portrait" expression="happy" />)

    expect(container.querySelector('[data-bui-mascot="portrait"]')).toHaveAttribute(
      'data-bui-expression',
      'happy',
    )
    expect(container.querySelector('[data-part="body-unit"]')).not.toBeInTheDocument()
  })
})
