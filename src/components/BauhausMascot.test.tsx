import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { BauhausMascot } from './BauhausMascot'

const poses = ['standing', 'working', 'running'] as const
const expressions = ['curious', 'focused', 'happy', 'playful', 'proud', 'calm'] as const
const viewBoxes = {
  standing: '0 0 760 520',
  working: '0 0 520 520',
  running: '0 0 760 340',
}

function staticHeadGeometry(head: Element) {
  const copy = head.cloneNode(true) as Element
  copy.querySelector('[data-part="expression"]')?.remove()
  copy.removeAttribute('data-expression')
  copy.querySelectorAll('[data-expression]').forEach((part) => part.removeAttribute('data-expression'))
  return copy.innerHTML
}

function reflectsHorizontally(unit: Element) {
  return /scale\(\s*-\d/.test(unit.getAttribute('transform') ?? '')
}

describe('BauhausMascot', () => {
  it('is decorative by default and exposes an image label when requested', () => {
    const { container, rerender } = render(<BauhausMascot />)
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.queryByRole('img')).not.toBeInTheDocument()

    rerender(<BauhausMascot label="Bauhaus dog" />)
    expect(screen.getByRole('img', { name: 'Bauhaus dog' })).not.toHaveAttribute('aria-hidden', 'true')
  })

  it('passes SVG attributes, styles, and event handlers through to the illustration', () => {
    const onClick = vi.fn()
    render(
      <BauhausMascot
        label="Clickable Bau"
        id="custom-bau"
        className="custom-mascot"
        width={320}
        height={240}
        style={{ opacity: 0.8 }}
        data-project="studio"
        onClick={onClick}
      />,
    )

    const artwork = screen.getByRole('img', { name: 'Clickable Bau' })
    expect(artwork).toHaveAttribute('id', 'custom-bau')
    expect(artwork).toHaveClass('custom-mascot')
    expect(artwork).toHaveAttribute('width', '320')
    expect(artwork).toHaveAttribute('height', '240')
    expect(artwork).toHaveAttribute('data-project', 'studio')
    expect(artwork).toHaveStyle({ opacity: '0.8' })
    fireEvent.click(artwork)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it.each(poses)('preserves the full %s composition and its public viewBox', (pose) => {
    const { container } = render(<BauhausMascot pose={pose} />)
    const dog = container.querySelector('[data-part="dog-unit"]')

    expect(container.querySelector('svg')).toHaveAttribute('viewBox', viewBoxes[pose])
    expect(container.querySelectorAll('[data-part="dog-unit"]')).toHaveLength(1)
    expect(dog).toContainElement(container.querySelector('[data-part="body-unit"]'))
    expect(dog).toContainElement(container.querySelector('[data-part="head-unit"]'))
  })

  it('defaults to the curious expression', () => {
    const { container } = render(
      <>
        <BauhausMascot />
        <BauhausMascot expression="curious" />
      </>,
    )
    const [defaultArtwork, explicitCuriousArtwork] = [...container.querySelectorAll('svg')]

    expect(defaultArtwork).toHaveAttribute('data-bui-expression', 'curious')
    expect(defaultArtwork.querySelector('[data-part="expression"]')?.innerHTML).toBe(
      explicitCuriousArtwork.querySelector('[data-part="expression"]')?.innerHTML,
    )
  })

  it('provides six distinct facial states without changing the canonical head geometry', () => {
    const { container } = render(
      <>
        {expressions.map((expression) => (
          <BauhausMascot key={expression} variant="portrait" expression={expression} />
        ))}
      </>,
    )
    const artworks = [...container.querySelectorAll('svg')]
    const heads = [...container.querySelectorAll('[data-part="head-unit"]')]
    const faces = [...container.querySelectorAll('[data-part="expression"]')]

    expect(artworks.map((artwork) => artwork.getAttribute('data-bui-expression'))).toEqual(expressions)
    expect(faces).toHaveLength(6)
    expect(new Set(faces.map((face) => face.innerHTML)).size).toBe(6)
    faces.forEach((face) => {
      expect(face.querySelector('[data-part="eye"]')).toBeInTheDocument()
      expect(face.querySelector('[data-part="mouth"]')).toBeInTheDocument()
    })
    expect(heads).toHaveLength(6)
    expect(new Set(heads.map(staticHeadGeometry)).size).toBe(1)
  })

  it.each(expressions)('shares exactly the same %s head across all full-body poses', (expression) => {
    const { container } = render(
      <>
        {poses.map((pose) => (
          <BauhausMascot key={pose} pose={pose} expression={expression} />
        ))}
      </>,
    )
    const heads = [...container.querySelectorAll('[data-part="head-unit"]')]

    expect(heads).toHaveLength(3)
    expect(heads[0].querySelector('[data-part="head"]')).toBeInTheDocument()
    expect(new Set(heads.map((head) => head.innerHTML)).size).toBe(1)
  })

  it.each(poses)('includes the %s scene only when requested', (pose) => {
    const { container, rerender } = render(<BauhausMascot pose={pose} scene={false} />)
    expect(container.querySelector('[data-part="scene"]')).not.toBeInTheDocument()

    rerender(<BauhausMascot pose={pose} scene />)
    expect(container.querySelectorAll('[data-part="scene"]')).toHaveLength(1)
  })

  it.each(poses)('mirrors only the %s foreground and leaves scene geometry unchanged', (pose) => {
    const { container } = render(
      <>
        <BauhausMascot pose={pose} direction="left" expression="happy" scene />
        <BauhausMascot pose={pose} direction="right" expression="happy" scene />
      </>,
    )
    const [leftArtwork, rightArtwork] = [...container.querySelectorAll('svg')]
    const scenes = [leftArtwork, rightArtwork].map((artwork) =>
      artwork.querySelector<SVGElement>('[data-part="scene"]'),
    )
    const units = [leftArtwork, rightArtwork].map((artwork) =>
      artwork.querySelector<SVGElement>(
        pose === 'working' ? '[data-part="foreground-unit"]' : '[data-part="dog-unit"]',
      ),
    )

    expect(scenes[0]?.innerHTML).toBe(scenes[1]?.innerHTML)
    scenes.forEach((scene, index) => {
      expect(scene).toBeInTheDocument()
      expect(scene).not.toHaveAttribute('transform')
      expect(units[index]).toBeInTheDocument()
      expect(units[index]).not.toContainElement(scene)
      expect(units[index]).toContainElement(
        [leftArtwork, rightArtwork][index].querySelector('[data-part="head-unit"]'),
      )
      expect(units[index]).toContainElement(
        [leftArtwork, rightArtwork][index].querySelector('[data-part="body-unit"]'),
      )
      if (pose === 'working') {
        expect(units[index]).toContainElement(
          [leftArtwork, rightArtwork][index].querySelector('[data-part="desk"]'),
        )
      }
    })
    expect(reflectsHorizontally(units[0]!)).toBe(pose !== 'standing')
    expect(reflectsHorizontally(units[1]!)).toBe(pose === 'standing')
  })

  it.each(poses)('keeps %s default artwork explicitly right-facing', (pose) => {
    const { container } = render(
      <>
        <BauhausMascot pose={pose} expression="calm" scene />
        <BauhausMascot pose={pose} direction="right" expression="calm" scene />
      </>,
    )
    const [defaultArtwork, explicitRightArtwork] = [...container.querySelectorAll('svg')]
    expect(defaultArtwork.innerHTML).toBe(explicitRightArtwork.innerHTML)
  })

  it.each(poses)('renders a canonical portrait for %s without body or scene geometry', (pose) => {
    const { container } = render(
      <>
        <BauhausMascot pose={pose} variant="portrait" direction="left" expression="focused" scene />
        <BauhausMascot pose={pose} variant="portrait" direction="right" expression="focused" scene />
      </>,
    )
    const artworks = [...container.querySelectorAll('svg')]
    const portraits = artworks.map((artwork) => artwork.querySelector('[data-part="portrait-unit"]'))

    artworks.forEach((artwork, index) => {
      expect(artwork).toHaveAttribute('data-bui-mascot', 'portrait')
      expect(artwork).toHaveAttribute('viewBox', '0 0 220 225')
      expect(artwork.querySelector('[data-part="body-unit"]')).not.toBeInTheDocument()
      expect(artwork.querySelector('[data-part="dog-unit"]')).not.toBeInTheDocument()
      expect(artwork.querySelector('[data-part="scene"]')).not.toBeInTheDocument()
      expect(portraits[index]).toContainElement(artwork.querySelector('[data-part="head-unit"]'))
    })
    expect(portraits[0]?.getAttribute('transform')).not.toBe(portraits[1]?.getAttribute('transform'))
    expect(reflectsHorizontally(portraits[0]!)).not.toBe(reflectsHorizontally(portraits[1]!))
  })
})
