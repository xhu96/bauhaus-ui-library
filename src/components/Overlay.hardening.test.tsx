import { StrictMode, useState } from 'react'
import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Modal, ModalBody, ModalFooter } from './Modal'
import { Drawer } from './Drawer'
import { ToastProvider, useToast } from './Toast'
import { Tooltip } from './Tooltip'

// jsdom has no layout. Model displayed rectangles only here; production keeps
// tabbable's full visibility checks. Real layout/focus is covered in browser QA.
beforeEach(() => {
  vi.spyOn(Element.prototype, 'getClientRects').mockImplementation(function (this: Element) {
    let element: Element | null = this.closest('*')
    while (element) {
      if (element.hasAttribute('hidden') || getComputedStyle(element).display === 'none')
        return [] as unknown as DOMRectList
      element = element.parentElement
    }
    return [new DOMRect(0, 0, 100, 20)] as unknown as DOMRectList
  })
})
afterEach(() => vi.restoreAllMocks())

describe('dialog hardening', () => {
  it.each([Modal, Drawer])('warns clearly for an unnamed dialog in development', (Component) => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {})
    render(<Component open onClose={() => {}} />)
    expect(warning).toHaveBeenCalledWith(expect.stringContaining('requires a title or aria-label'))
  })
  it('lets a tooltip consume Escape before the dialog closes', async () => {
    const close = vi.fn()
    render(
      <Modal open title="Help" onClose={close}>
        <Tooltip content="Tip" delay={0}>
          <button>Details</button>
        </Tooltip>
      </Modal>,
    )
    fireEvent.focus(screen.getByRole('button', { name: 'Details' }))
    expect(await screen.findByRole('tooltip')).toBeInTheDocument()
    fireEvent.keyDown(screen.getByRole('button', { name: 'Details' }), { key: 'Escape' })
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    expect(close).not.toHaveBeenCalled()
    fireEvent.keyDown(screen.getByRole('button', { name: 'Details' }), { key: 'Escape' })
    expect(close).toHaveBeenCalledOnce()
  })

  it('registers a changed portal host and restores both hosts after unmount', () => {
    const first = document.createElement('section')
    const second = document.createElement('section')
    document.body.append(first, second)
    const view = render(
      <StrictMode>
        <Modal open title="Moving" onClose={() => {}} portalContainer={first} />
      </StrictMode>,
    )
    view.rerender(
      <StrictMode>
        <Modal open title="Moving" onClose={() => {}} portalContainer={second} />
      </StrictMode>,
    )
    expect(second).toContainElement(screen.getByRole('dialog'))
    expect(second).not.toHaveAttribute('inert')
    expect(first).toHaveAttribute('inert')
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus()
    view.unmount()
    expect(first).not.toHaveAttribute('inert')
    expect(second).not.toHaveAttribute('inert')
    expect(document.body.style.overflow).toBe('')
  })
  it('uses its visible title and a bounded scrolling panel', () => {
    render(
      <Modal open onClose={() => {}} title="Long form">
        <ModalBody>{'Long content '.repeat(300)}</ModalBody>
        <ModalFooter>
          <button>Save</button>
        </ModalFooter>
      </Modal>,
    )
    const panel = screen.getByRole('dialog', { name: 'Long form' })
    expect(panel).toHaveAttribute('aria-labelledby', screen.getByRole('heading').id)
    expect(panel.style.maxHeight).toBe('calc(100dvh - 2rem)')
    expect(panel).toHaveClass('bui-overflow-y-auto')
  })

  it('ignores hidden and negative-tabindex candidates and recovers Tab from panel focus', () => {
    render(
      <Modal open onClose={() => {}} title="Focus">
        <button>Last</button>
        <button hidden>Hidden</button>
        <button style={{ display: 'none' }}>Display none</button>
        <button style={{ visibility: 'hidden' }}>Invisible</button>
        <button tabIndex={-1}>Skipped</button>
      </Modal>,
    )
    const panel = screen.getByRole('dialog')
    screen.getByRole('button', { name: 'Last' }).focus()
    fireEvent.keyDown(document.activeElement!, { key: 'Tab' })
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus()
    panel.focus()
    fireEvent.keyDown(panel, { key: 'Tab', shiftKey: true })
    expect(screen.getByRole('button', { name: 'Last' })).toHaveFocus()
  })

  it('respects consumed Escape', () => {
    const close = vi.fn()
    render(
      <Drawer open title="Edit" onClose={close}>
        <input aria-label="Editor" onKeyDown={(e) => e.preventDefault()} />
      </Drawer>,
    )
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Escape' })
    expect(close).not.toHaveBeenCalled()
  })

  it('isolates ancestor siblings for local portals, observes new siblings, and restores prior state', async () => {
    const host = document.createElement('section')
    const sibling = document.createElement('button')
    const inertSibling = document.createElement('div')
    inertSibling.setAttribute('inert', 'original')
    host.append(sibling, inertSibling)
    document.body.append(host)
    document.body.style.overflow = 'clip'
    const view = render(
      <StrictMode>
        <Modal open title="Local" onClose={() => {}} portalContainer={host}>
          <button>Inside</button>
        </Modal>
      </StrictMode>,
    )
    expect(host).not.toHaveAttribute('inert')
    expect(sibling).toHaveAttribute('inert')
    const late = document.createElement('button')
    await act(async () => {
      host.append(late)
    })
    expect(late).toHaveAttribute('inert')
    view.unmount()
    expect(sibling).not.toHaveAttribute('inert')
    expect(late).not.toHaveAttribute('inert')
    expect(inertSibling).toHaveAttribute('inert', 'original')
    expect(document.body.style.overflow).toBe('clip')
    document.body.style.overflow = ''
  })

  it('restores the parent panel when the nested trigger disappears', () => {
    function Example() {
      const [nested, setNested] = useState(false)
      return (
        <Modal open title="Parent" onClose={() => {}}>
          {!nested && <button onClick={() => setNested(true)}>Launch</button>}
          <Drawer open={nested} title="Child" onClose={() => setNested(false)} />
        </Modal>
      )
    }
    render(<Example />)
    const trigger = screen.getByRole('button', { name: 'Launch' })
    trigger.focus()
    fireEvent.click(trigger)
    fireEvent.keyDown(screen.getByRole('dialog', { name: 'Child' }), { key: 'Escape' })
    expect(screen.getByRole('dialog', { name: 'Parent' })).toContainElement(
      document.activeElement as HTMLElement,
    )
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('places toast dismiss actions inside the active dialog and moves them back after close', () => {
    function Trigger() {
      const { toast } = useToast()
      return <button onClick={() => toast({ title: 'Saved', duration: 0 })}>Notify</button>
    }
    function Example() {
      const [open, setOpen] = useState(true)
      return (
        <ToastProvider>
          <Modal open={open} title="Edit" onClose={() => setOpen(false)}>
            <Trigger />
          </Modal>
        </ToastProvider>
      )
    }
    render(<Example />)
    fireEvent.click(screen.getByRole('button', { name: 'Notify' }))
    expect(within(screen.getByRole('dialog')).getByRole('status')).toHaveTextContent('Saved')
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
    expect(screen.getByRole('status')).toHaveTextContent('Saved')
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.queryByText('Saved')).not.toBeInTheDocument()
  })
})
