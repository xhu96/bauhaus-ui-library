import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
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

    expect(screen.getByRole('dialog', { name: 'Filters' })).toHaveClass('animate-slide-in-left')
  })
})
