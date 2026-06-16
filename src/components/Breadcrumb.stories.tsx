import type { Meta, StoryObj } from '@storybook/react'
import { Slash } from 'lucide-react'
import { Breadcrumb, BreadcrumbItem } from './Breadcrumb'

const meta = {
  title: 'Navigation/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  argTypes: {
    separator: {
      control: 'text',
      description: 'Node inserted between items. Defaults to a small chevron icon.',
    },
    className: { control: 'text' },
    children: { control: false },
  },
  args: {
    children: null,
  },
} satisfies Meta<typeof Breadcrumb>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: (
      <>
        <BreadcrumbItem href="#">Home</BreadcrumbItem>
        <BreadcrumbItem href="#">Catalog</BreadcrumbItem>
        <BreadcrumbItem href="#">Furniture</BreadcrumbItem>
        <BreadcrumbItem current>Wassily Chair</BreadcrumbItem>
      </>
    ),
  },
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

/** A plain string separator: `separator` is typed `ReactNode`, so it accepts arbitrary content. */
export const StringSeparator: Story = {
  render: () => (
    <Breadcrumb separator="/">
      <BreadcrumbItem href="#">Home</BreadcrumbItem>
      <BreadcrumbItem href="#">Projects</BreadcrumbItem>
      <BreadcrumbItem current>Bauhaus</BreadcrumbItem>
    </Breadcrumb>
  ),
}

/** A single crumb: proves no trailing separator is rendered for the last (only) item. */
export const SingleItem: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbItem current>Home</BreadcrumbItem>
    </Breadcrumb>
  ),
}

/**
 * Every crumb is a link with no `current` page. The last item here has neither
 * `href` nor `current`, exercising the non-navigable link branch.
 */
export const NoCurrentPage: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbItem href="#">Home</BreadcrumbItem>
      <BreadcrumbItem href="#">Catalog</BreadcrumbItem>
      <BreadcrumbItem>Furniture</BreadcrumbItem>
    </Breadcrumb>
  ),
}
