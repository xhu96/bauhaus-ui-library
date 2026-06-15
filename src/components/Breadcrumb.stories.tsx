import type { Meta, StoryObj } from '@storybook/react'
import { Slash } from 'lucide-react'
import { Breadcrumb, BreadcrumbItem } from './Breadcrumb'

const meta = {
  title: 'Navigation/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  args: {
    children: null,
  },
} satisfies Meta<typeof Breadcrumb>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbItem href="#">Home</BreadcrumbItem>
      <BreadcrumbItem href="#">Catalog</BreadcrumbItem>
      <BreadcrumbItem href="#">Furniture</BreadcrumbItem>
      <BreadcrumbItem current>Wassily Chair</BreadcrumbItem>
    </Breadcrumb>
  ),
}

export const CustomSeparator: Story = {
  render: () => (
    <Breadcrumb separator={<Slash className="h-4 w-4 text-ink-muted" aria-hidden />}>
      <BreadcrumbItem href="#">Home</BreadcrumbItem>
      <BreadcrumbItem href="#">Library</BreadcrumbItem>
      <BreadcrumbItem current>Data</BreadcrumbItem>
    </Breadcrumb>
  ),
}
