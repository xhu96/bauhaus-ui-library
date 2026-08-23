import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Navbar, NavbarBrand, NavbarContent, NavbarLink } from './Navbar'

describe('Navbar', () => {
  it('renders navbar structure with brand and navigation links', () => {
    render(
      <Navbar>
        <NavbarBrand>Bauhaus UI</NavbarBrand>
        <NavbarContent justify="end">
          <NavbarLink href="/components" active>
            Components
          </NavbarLink>
          <NavbarLink href="/docs">Docs</NavbarLink>
        </NavbarContent>
      </Navbar>,
    )

    const nav = screen.getByRole('navigation')
    expect(nav).toBeInTheDocument()
    expect(screen.getByText('Bauhaus UI')).toBeInTheDocument()

    const activeLink = screen.getByRole('link', { name: 'Components' })
    expect(activeLink).toHaveAttribute('aria-current', 'page')

    const regularLink = screen.getByRole('link', { name: 'Docs' })
    expect(regularLink).not.toHaveAttribute('aria-current')
  })

  it('applies sticky positioning when sticky prop is set', () => {
    render(
      <Navbar sticky>
        <NavbarBrand>Brand</NavbarBrand>
      </Navbar>,
    )

    expect(screen.getByRole('navigation')).toHaveClass('bui-sticky', 'bui-top-0')
  })
})
