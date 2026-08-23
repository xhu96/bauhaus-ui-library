import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Breadcrumb, BreadcrumbItem } from './Breadcrumb'

describe('Breadcrumb', () => {
  it('renders breadcrumb links and active page indicator', () => {
    render(
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/docs">Docs</BreadcrumbItem>
        <BreadcrumbItem current>Components</BreadcrumbItem>
      </Breadcrumb>,
    )

    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' })
    expect(nav).toBeInTheDocument()

    const homeLink = screen.getByRole('link', { name: 'Home' })
    expect(homeLink).toHaveAttribute('href', '/')

    const currentItem = screen.getByText('Components')
    expect(currentItem).toHaveAttribute('aria-current', 'page')
    expect(currentItem.tagName.toLowerCase()).toBe('span')
  })

  it('resets ordered-list browser defaults without relying on Preflight', () => {
    render(
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem current>Library</BreadcrumbItem>
      </Breadcrumb>,
    )

    const list = screen.getByRole('list')
    expect(list).toHaveClass('bui-m-0', 'bui-list-none', 'bui-p-0')
  })

  it('renders custom separators between crumbs', () => {
    render(
      <Breadcrumb separator={<span data-testid="custom-sep">/</span>}>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem current>Library</BreadcrumbItem>
      </Breadcrumb>,
    )

    expect(screen.getByTestId('custom-sep')).toBeInTheDocument()
  })
})
