import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('marks the component for the scoped library reset', () => {
    render(<Button>Reset marker</Button>)
    expect(screen.getByRole('button', { name: 'Reset marker' })).toHaveClass('bui-reset')
  })

  it('disables the native button while loading and uses the shared Bauhaus spinner', () => {
    const { container } = render(<Button isLoading>Save</Button>)

    const button = screen.getByRole('button', { name: 'Save' })
    expect(button).toBeDisabled()
    expect(button.querySelector('circle')).toHaveAttribute('stroke-dasharray', '72 28')
    expect(container.querySelector('[role="status"]')).not.toBeInTheDocument()
  })

  it('defaults to type="button" and handles clicks', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    const button = screen.getByRole('button', { name: 'Click me' })
    expect(button).toHaveAttribute('type', 'button')

    await user.click(button)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('renders left and right icons', () => {
    render(
      <Button
        leftIcon={<span data-testid="left-icon">L</span>}
        rightIcon={<span data-testid="right-icon">R</span>}
      >
        Action
      </Button>,
    )

    expect(screen.getByTestId('left-icon')).toBeInTheDocument()
    expect(screen.getByTestId('right-icon')).toBeInTheDocument()
  })
})
