import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { Alert } from './Alert'
import { Tag } from './Tag'
import { Pagination } from './Pagination'
import { Modal } from './Modal'
import { Drawer } from './Drawer'
import { Navbar } from './Navbar'

it('preserves Navbar label and direction passthrough', () => {
  render(
    <Navbar aria-label="Navigation principale" dir="rtl">
      Links
    </Navbar>,
  )
  expect(screen.getByRole('navigation', { name: 'Navigation principale' })).toHaveAttribute('dir', 'rtl')
})

it('allows translated internal control labels', () => {
  render(
    <>
      <Alert onClose={() => {}} dismissLabel="Ignorer" />
      <Tag onRemove={() => {}} removeLabel="Supprimer" />
      <Pagination
        page={2}
        count={3}
        onPageChange={() => {}}
        aria-label="Pages"
        previousLabel="Précédent"
        nextLabel="Suivant"
        getPageLabel={(page) => `Page ${page}`}
      />
    </>,
  )
  for (const name of ['Ignorer', 'Supprimer', 'Précédent', 'Suivant', 'Page 2'])
    expect(screen.getByRole('button', { name })).toBeInTheDocument()
  expect(screen.getByRole('navigation', { name: 'Pages' })).toBeInTheDocument()
})

it.each([Modal, Drawer])('allows a translated dialog close label', (Component) => {
  render(<Component open title="Example" onClose={() => {}} closeLabel="Fermer" />)
  expect(screen.getByRole('button', { name: 'Fermer' })).toBeInTheDocument()
})
