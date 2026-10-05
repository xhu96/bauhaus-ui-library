import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import BauPage from './BauPage'

describe('BauPage', () => {
  it('explains that Bau requires the unpublished preview', () => {
    render(<BauPage />)
    expect(screen.getByText(/0.2.0dev2 is unpublished/)).toHaveTextContent(
      'npm currently installs 0.1.1, which does not include Bau',
    )
    expect(screen.getByRole('link', { name: 'Install the local preview' })).toHaveAttribute(
      'href',
      '../storybook/?path=/docs/introduction--docs',
    )
  })
  it('documents one mascot identity across expressions and poses', () => {
    const { container } = render(<BauPage />)

    expect(screen.getByRole('heading', { name: 'BAU', level: 1 })).toBeInTheDocument()
    expect(screen.getByText('The Bauhaus dog')).toBeInTheDocument()
    const portraits = [...container.querySelectorAll('.bau-expression-rail [data-bui-mascot="portrait"]')]
    expect(portraits).toHaveLength(6)
    expect(portraits.map((portrait) => portrait.getAttribute('data-bui-expression'))).toEqual([
      'curious',
      'focused',
      'happy',
      'playful',
      'proud',
      'calm',
    ])
    portraits.forEach((portrait) => {
      expect(portrait.querySelector('[data-part="head-unit"]')).toBeInTheDocument()
      expect(portrait.querySelector('[data-part="body-unit"]')).not.toBeInTheDocument()
    })
  })

  it.each([0, 1])('updates the code and selected gallery pose from control set %s', async (controlSet) => {
    const user = userEvent.setup()
    const { container } = render(<BauPage />)

    await user.click(screen.getAllByRole('button', { name: /Running/ })[controlSet])
    const code = container.querySelector('.bau-api code')
    const gallery = screen.getByRole('region', { name: 'Pose gallery' })
    const running = within(gallery).getByRole('button', { name: /Running/ })
    expect(code).toHaveTextContent('<BauhausMascot pose="running" expression="focused" />')
    expect(running).toHaveAttribute('aria-pressed', 'true')
    expect(running.querySelector('svg')).toHaveAttribute('data-bui-expression', 'focused')

    await user.click(screen.getAllByRole('button', { name: /Working/ })[controlSet])
    const working = within(gallery).getByRole('button', { name: /Working/ })
    expect(code).toHaveTextContent('<BauhausMascot pose="working" expression="happy" />')
    expect(working).toHaveAttribute('aria-pressed', 'true')
    expect(working.querySelector('svg')).toHaveAttribute('data-bui-expression', 'happy')
    expect(running).toHaveAttribute('aria-pressed', 'false')
  })

  it('provides a real path back to the library', () => {
    render(<BauPage />)
    expect(screen.getByRole('link', { name: /Back to library/ })).toHaveAttribute('href', '../')
  })
})
