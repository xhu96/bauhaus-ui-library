import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './Button'
import { Drawer } from './Drawer'
import { Modal, ModalBody, ModalFooter } from './Modal'

function ModalHarness() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Join">
        <ModalBody>
          <input aria-label="Name" />
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => setOpen(false)}>Submit</Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

function DrawerHarness() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open drawer</Button>
      <Drawer open={open} onClose={() => setOpen(false)} title="Filters">
        <Button>Apply</Button>
      </Drawer>
    </>
  )
}

describe('overlay focus behavior', () => {
  it('traps focus in the Modal and restores the trigger after Escape', async () => {
    const user = userEvent.setup()
    render(<ModalHarness />)
    const trigger = screen.getByRole('button', { name: 'Open modal' })

    await user.click(trigger)
    const close = screen.getByRole('button', { name: 'Close' })
    const submit = screen.getByRole('button', { name: 'Submit' })

    expect(close).toHaveFocus()
    await user.tab({ shift: true })
    expect(submit).toHaveFocus()
    await user.tab()
    expect(close).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(trigger).toHaveFocus()
  })

  it('traps focus in the Drawer and restores its trigger', async () => {
    const user = userEvent.setup()
    render(<DrawerHarness />)
    const trigger = screen.getByRole('button', { name: 'Open drawer' })

    await user.click(trigger)
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(trigger).toHaveFocus()
  })

  it('supports an explicit accessible name without a visible title', () => {
    render(
      <Modal open onClose={() => {}} aria-label="Untitled confirmation">
        <ModalBody>Body</ModalBody>
      </Modal>,
    )

    expect(screen.getByRole('dialog', { name: 'Untitled confirmation' })).toBeInTheDocument()
  })

  it('uses the left-side animation class for a left Drawer', () => {
    render(
      <Drawer open onClose={() => {}} side="left" title="Filters">
        Body
      </Drawer>,
    )

    expect(screen.getByRole('dialog', { name: 'Filters' })).toHaveClass('bui-animate-slide-in-left')
  })

  it('keeps body scroll locked and root inert when stacked dialogs are open', async () => {
    const user = userEvent.setup()
    function StackedHarness() {
      const [openA, setOpenA] = useState(false)
      const [openB, setOpenB] = useState(false)

      return (
        <div id="root">
          <Button onClick={() => setOpenA(true)}>Open A</Button>
          <Modal open={openA} onClose={() => setOpenA(false)} title="Modal A">
            <ModalBody>
              <Button onClick={() => setOpenB(true)}>Open B</Button>
            </ModalBody>
          </Modal>
          <Modal open={openB} onClose={() => setOpenB(false)} title="Modal B">
            <ModalBody>Nested</ModalBody>
          </Modal>
        </div>
      )
    }

    render(<StackedHarness />)
    const root = document.getElementById('root')!

    await user.click(screen.getByRole('button', { name: 'Open A' }))
    expect(document.body.style.overflow).toBe('hidden')
    expect(root).toHaveAttribute('inert')

    await user.click(screen.getByRole('button', { name: 'Open B' }))
    expect(document.body.style.overflow).toBe('hidden')
    expect(root).toHaveAttribute('inert')

    // Escape should only close topmost dialog (Modal B)
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog', { name: 'Modal B' })).not.toBeInTheDocument()
    expect(screen.getByRole('dialog', { name: 'Modal A' })).toBeInTheDocument()
    expect(document.body.style.overflow).toBe('hidden')
    expect(root).toHaveAttribute('inert')

    // Close Modal A
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog', { name: 'Modal A' })).not.toBeInTheDocument()
    expect(document.body.style.overflow).toBe('')
    expect(root).not.toHaveAttribute('inert')
  })

  it('inerts arbitrary body content and restores pre-existing inert state', async () => {
    const user = userEvent.setup()

    const preInert = document.createElement('section')
    preInert.id = 'pre-inert-content'
    preInert.setAttribute('inert', '')
    document.body.appendChild(preInert)

    function ArbitraryRootHarness() {
      const [open, setOpen] = useState(false)
      return (
        <div id="application-shell">
          <Button onClick={() => setOpen(true)}>Open arbitrary-root modal</Button>
          <Modal open={open} onClose={() => setOpen(false)} title="Arbitrary root">
            <ModalBody>Body</ModalBody>
          </Modal>
        </div>
      )
    }

    const { container } = render(<ArbitraryRootHarness />)
    const renderRoot = container

    await user.click(screen.getByRole('button', { name: 'Open arbitrary-root modal' }))
    expect(renderRoot).toHaveAttribute('inert')
    expect(preInert).toHaveAttribute('inert')

    await user.keyboard('{Escape}')
    expect(renderRoot).not.toHaveAttribute('inert')
    expect(preInert).toHaveAttribute('inert')
  })

  it('activates dialog behavior for an initially-open Modal', async () => {
    const user = userEvent.setup()
    const handleClose = vi.fn()
    render(
      <Modal open onClose={handleClose} title="Initial Modal">
        <ModalBody>
          <Button>Inside</Button>
        </ModalBody>
      </Modal>,
    )

    const dialog = screen.getByRole('dialog', { name: 'Initial Modal' })
    expect(dialog).toBeInTheDocument()

    // Focus should have moved into the dialog
    const closeBtn = screen.getByRole('button', { name: 'Close' })
    expect(closeBtn).toHaveFocus()

    // Escape should trigger onClose
    await user.keyboard('{Escape}')
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('activates dialog behavior for an initially-open Drawer', async () => {
    const user = userEvent.setup()
    const handleClose = vi.fn()
    render(
      <Drawer open onClose={handleClose} title="Initial Drawer">
        <Button>Inside</Button>
      </Drawer>,
    )

    const dialog = screen.getByRole('dialog', { name: 'Initial Drawer' })
    expect(dialog).toBeInTheDocument()

    // Focus should have moved into the drawer
    const closeBtn = screen.getByRole('button', { name: 'Close' })
    expect(closeBtn).toHaveFocus()

    // Escape should trigger onClose
    await user.keyboard('{Escape}')
    expect(handleClose).toHaveBeenCalledTimes(1)
  })
})
