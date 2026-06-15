import type { Meta, StoryObj } from '@storybook/react'
import { Navbar, NavbarBrand, NavbarContent, NavbarLink } from './Navbar'

const meta = {
  title: 'Navigation/Navbar',
  component: Navbar,
  tags: ['autodocs'],
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
