import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Tag } from './Tag'

describe('Tag', () => {
  it('renders tag label with color dot', () => {
    render(
      <Tag color="red" dot>
        Red Label
      </Tag>,
    )

    expect(screen.getByText('Red Label')).toBeInTheDocument()
  })

  it('renders remove button and calls onRemove', async () => {
    const user = userEvent.setup()
    const handleRemove = vi.fn()
    render(<Tag onRemove={handleRemove}>Removable</Tag>)

    const removeBtn = screen.getByRole('button', { name: /remove/i })
    expect(removeBtn).toBeInTheDocument()

    await user.click(removeBtn)
    expect(handleRemove).toHaveBeenCalledTimes(1)
  })
})
