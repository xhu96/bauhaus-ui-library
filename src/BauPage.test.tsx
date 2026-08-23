import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import BauPage from './BauPage'

describe('BauPage', () => {
  it('documents one mascot identity across expressions and poses', () => {
    const { container } = render(<BauPage />)

    expect(screen.getByRole('heading', { name: 'BAU', level: 1 })).toBeInTheDocument()
    expect(screen.getByText('The Bauhaus dog')).toBeInTheDocument()
    expect(container.querySelectorAll('[data-bui-mascot="portrait"]')).toHaveLength(6)
    expect(container.querySelectorAll('[data-part="chest"]')).toHaveLength(6)
  })

  it('updates the code example from either pose control', async () => {
    const user = userEvent.setup()
    const { container } = render(<BauPage />)

    await user.click(screen.getAllByRole('button', { name: /Running/ })[0])
    expect(container.querySelector('.bau-api code')).toHaveTextContent('<BauhausMascot pose="running" />')
  })

  it('provides a real path back to the library', () => {
    render(<BauPage />)
    expect(screen.getByRole('link', { name: /Back to library/ })).toHaveAttribute('href', '../')
  })
})
