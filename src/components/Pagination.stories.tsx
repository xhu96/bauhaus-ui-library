import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Pagination } from './Pagination'

const meta = {
  title: 'Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  args: {
    count: 10,
    siblingCount: 1,
    color: 'ink',
    page: 1,
    onPageChange: () => {},
  },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

function PaginationDemo({ count, color }: { count: number; color?: 'red' | 'blue' | 'yellow' | 'ink' }) {
  const [page, setPage] = useState(1)
  return <Pagination page={page} count={count} onPageChange={setPage} color={color} />
}

export const Default: Story = {
  render: () => <PaginationDemo count={10} />,
}

export const ManyPages: Story = {
  render: () => <PaginationDemo count={25} />,
}

export const Colored: Story = {
  render: () => <PaginationDemo count={8} color="red" />,
}
