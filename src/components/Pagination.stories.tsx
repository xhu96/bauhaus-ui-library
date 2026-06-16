import type { Meta, StoryObj } from '@storybook/react'
import { fn, within, userEvent, expect } from '@storybook/test'
import { useState } from 'react'
import { Pagination } from './Pagination'

const meta = {
  title: 'Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['red', 'blue', 'yellow', 'ink'],
    },
    count: { control: { type: 'number', min: 0 } },
    page: { control: { type: 'number', min: 1 } },
    siblingCount: { control: { type: 'range', min: 0, max: 3, step: 1 } },
    onPageChange: { action: 'pageChanged' },
  },
  args: {
    count: 10,
    siblingCount: 1,
    color: 'ink',
    page: 1,
    onPageChange: fn(),
  },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

function PaginationDemo({
  count,
  color,
  siblingCount,
  initialPage = 1,
}: {
  count: number
  color?: 'red' | 'blue' | 'yellow' | 'ink'
  siblingCount?: number
  initialPage?: number
}) {
  const [page, setPage] = useState(initialPage)
  return (
    <Pagination
      page={page}
      count={count}
      onPageChange={setPage}
      color={color}
      siblingCount={siblingCount}
    />
  )
}

/** Args-driven: the Controls panel directly drives this story. */
export const Default: Story = {}

export const ManyPages: Story = {
  render: () => <PaginationDemo count={25} />,
}

export const Colored: Story = {
  render: () => <PaginationDemo count={8} color="red" />,
}

/** All four active-fill colors so each BauhausColor is demonstrated. */
export const AllColors: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <PaginationDemo count={8} color="ink" />
      <PaginationDemo count={8} color="red" />
      <PaginationDemo count={8} color="blue" />
      <PaginationDemo count={8} color="yellow" />
    </div>
  ),
}

/** Last page selected: Next is disabled while Prev stays enabled. */
export const LastPage: Story = {
  render: () => <PaginationDemo count={10} initialPage={10} />,
}

/** Single page: both Prev and Next are disabled simultaneously. */
export const SinglePage: Story = {
  render: () => <PaginationDemo count={1} />,
}

/** Few pages (count <= totalSlots) renders the full range with no ellipsis. */
export const NoEllipsis: Story = {
  render: () => <PaginationDemo count={6} />,
}

/** Current page in the middle produces ellipsis on both sides. */
export const DoubleEllipsis: Story = {
  render: () => <PaginationDemo count={25} initialPage={13} />,
}

/** siblingCount={0} tightens the visible window around the current page. */
export const NoSiblings: Story = {
  render: () => <PaginationDemo count={25} initialPage={13} siblingCount={0} />,
}

/** siblingCount={2} widens the visible window around the current page. */
export const WideSiblings: Story = {
  render: () => <PaginationDemo count={25} initialPage={13} siblingCount={2} />,
}

/** Exercises the core interaction: clicking a page button updates aria-current. */
export const Interactive: Story = {
  render: () => <PaginationDemo count={10} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const page1 = await canvas.findByRole('button', { name: 'Go to page 1' })
    expect(page1).toHaveAttribute('aria-current', 'page')

    const page3 = await canvas.findByRole('button', { name: 'Go to page 3' })
    await userEvent.click(page3)

    const activePage3 = await canvas.findByRole('button', { name: 'Go to page 3' })
    expect(activePage3).toHaveAttribute('aria-current', 'page')
    expect(canvas.getByRole('button', { name: 'Go to page 1' })).not.toHaveAttribute('aria-current')
  },
}
