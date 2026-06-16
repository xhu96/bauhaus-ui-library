import type { Meta, StoryObj } from '@storybook/react'
import { Navbar, NavbarBrand, NavbarContent, NavbarLink } from './Navbar'

const meta = {
  title: 'Navigation/Navbar',
  component: Navbar,
  tags: ['autodocs'],
  argTypes: {
    sticky: { control: 'boolean' },
  },
  args: {
    children: null,
  },
} satisfies Meta<typeof Navbar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Navbar>
      <NavbarBrand>Bauhaus</NavbarBrand>
      <NavbarContent justify="end">
        <NavbarLink href="#" active>
          Home
        </NavbarLink>
        <NavbarLink href="#">Work</NavbarLink>
        <NavbarLink href="#">About</NavbarLink>
        <NavbarLink href="#">Contact</NavbarLink>
      </NavbarContent>
    </Navbar>
  ),
}

export const Centered: Story = {
  render: () => (
    <Navbar>
      <NavbarBrand>Studio</NavbarBrand>
      <NavbarContent justify="center">
        <NavbarLink href="#" active>
          Gallery
        </NavbarLink>
        <NavbarLink href="#">Shop</NavbarLink>
        <NavbarLink href="#">Journal</NavbarLink>
      </NavbarContent>
    </Navbar>
  ),
}

export const JustifyStart: Story = {
  render: () => (
    <Navbar>
      <NavbarBrand>Atelier</NavbarBrand>
      <NavbarContent justify="start">
        <NavbarLink href="#" active>
          Overview
        </NavbarLink>
        <NavbarLink href="#">Pricing</NavbarLink>
        <NavbarLink href="#">Docs</NavbarLink>
      </NavbarContent>
    </Navbar>
  ),
}

export const Playground: Story = {
  args: {
    sticky: false,
    children: (
      <>
        <NavbarBrand>Bauhaus</NavbarBrand>
        <NavbarContent justify="end">
          <NavbarLink href="#" active>
            Home
          </NavbarLink>
          <NavbarLink href="#">Work</NavbarLink>
          <NavbarLink href="#">About</NavbarLink>
        </NavbarContent>
      </>
    ),
  },
}

export const Sticky: Story = {
  render: (args) => (
    <div style={{ height: 480, overflowY: 'auto' }}>
      <Navbar {...args} sticky>
        <NavbarBrand>Bauhaus</NavbarBrand>
        <NavbarContent justify="end">
          <NavbarLink href="#" active>
            Home
          </NavbarLink>
          <NavbarLink href="#">Work</NavbarLink>
          <NavbarLink href="#">About</NavbarLink>
        </NavbarContent>
      </Navbar>
      <div style={{ height: 1200, padding: 16 }}>
        Scroll this container — the bar stays pinned to the top.
      </div>
    </div>
  ),
}

export const BrandWithIcon: Story = {
  render: () => (
    <Navbar>
      <NavbarBrand>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <rect x="0" y="0" width="20" height="20" />
        </svg>
        Bauhaus
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarLink href="#" active>
          Home
        </NavbarLink>
        <NavbarLink href="#">Work</NavbarLink>
        <NavbarLink href="#">About</NavbarLink>
      </NavbarContent>
    </Navbar>
  ),
}
