import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './Accordion'
import { expectProviderError } from '../test/expectProviderError'

describe('Accordion', () => {
  it('preserves uncontrolled inputs and local state when a retained region is collapsed', async () => {
    const user = userEvent.setup()
    function Draft() {
      const [count, setCount] = useState(0)
      return (
        <>
          <input aria-label="Display name" defaultValue="Alice" />
          <button onClick={() => setCount(count + 1)}>Edits: {count}</button>
        </>
      )
    }
    render(
      <Accordion defaultValue="profile">
        <AccordionItem value="profile">
          <AccordionTrigger>Profile</AccordionTrigger>
          <AccordionContent keepMounted>
            <Draft />
          </AccordionContent>
        </AccordionItem>
      </Accordion>,
    )
    const input = screen.getByRole('textbox', { name: 'Display name' })
    await user.clear(input)
    await user.type(input, 'Anni')
    await user.click(screen.getByRole('button', { name: 'Edits: 0' }))
    await user.click(screen.getByRole('button', { name: 'Profile' }))

    expect(input).toBeInTheDocument()
    expect(input).not.toBeVisible()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Profile' }))
    expect(screen.getByRole('textbox', { name: 'Display name' })).toBe(input)
    expect(input).toHaveValue('Anni')
    expect(screen.getByRole('button', { name: 'Edits: 1' })).toBeVisible()
  })

  it('keeps a collapsed retained region hidden and out of keyboard navigation despite caller display props', async () => {
    const user = userEvent.setup()
    render(
      <>
        <Accordion>
          <AccordionItem value="profile">
            <AccordionTrigger>Profile</AccordionTrigger>
            <AccordionContent keepMounted hidden={false} className="bui-flex" style={{ display: 'flex' }}>
              <input aria-label="Display name" />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <button>After accordion</button>
      </>,
    )
    const region = screen.getByRole('region', { hidden: true })
    expect(region).toHaveAttribute('hidden')
    expect(region).toHaveStyle({ display: 'none' })
    expect(region).not.toHaveClass('bui-animate-fade-in')
    expect(screen.queryByRole('region')).not.toBeInTheDocument()

    screen.getByRole('button', { name: 'Profile' }).focus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'After accordion' })).toHaveFocus()

    await user.click(screen.getByRole('button', { name: 'Profile' }))
    expect(region).not.toHaveAttribute('hidden')
    expect(region).toHaveStyle({ display: 'flex' })
    expect(screen.getByRole('textbox', { name: 'Display name' })).toBeVisible()
  })

  it('still unmounts collapsed regions and resets their uncontrolled state by default', async () => {
    const user = userEvent.setup()
    render(
      <Accordion defaultValue="profile">
        <AccordionItem value="profile">
          <AccordionTrigger>Profile</AccordionTrigger>
          <AccordionContent>
            <input aria-label="Name" defaultValue="Alice" />
          </AccordionContent>
        </AccordionItem>
      </Accordion>,
    )
    const input = screen.getByRole('textbox', { name: 'Name' })
    await user.type(input, ' Smith')
    await user.click(screen.getByRole('button', { name: 'Profile' }))
    expect(input).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Profile' }))
    expect(screen.getByRole('textbox', { name: 'Name' })).not.toBe(input)
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('Alice')
  })

  it('toggles single item open and closed', async () => {
    const user = userEvent.setup()
    render(
      <Accordion type="single">
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Section 2</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
      </Accordion>,
    )

    expect(screen.queryByText('Content 1')).not.toBeInTheDocument()
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument()

    const trigger1 = screen.getByRole('button', { name: /Section 1/i })
    await user.click(trigger1)

    expect(screen.getByText('Content 1')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Section 1/i })).toHaveAttribute('aria-expanded', 'true')

    // Opening section 2 should close section 1 in single mode
    const trigger2 = screen.getByRole('button', { name: /Section 2/i })
    await user.click(trigger2)

    expect(screen.queryByText('Content 1')).not.toBeInTheDocument()
    expect(screen.getByText('Content 2')).toBeInTheDocument()
  })

  it('allows multiple items open simultaneously in multiple mode', async () => {
    const user = userEvent.setup()
    render(
      <Accordion type="multiple" defaultValue={['item-1']}>
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Section 2</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
      </Accordion>,
    )

    expect(screen.getByText('Content 1')).toBeInTheDocument()
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Section 2/i }))
    expect(screen.getByText('Content 1')).toBeInTheDocument()
    expect(screen.getByText('Content 2')).toBeInTheDocument()
  })

  it('preserves caller-provided onClick handler on trigger', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(
      <Accordion type="single">
        <AccordionItem value="item-1">
          <AccordionTrigger onClick={handleClick}>Section 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>,
    )

    await user.click(screen.getByRole('button', { name: /Section 1/i }))
    expect(handleClick).toHaveBeenCalledTimes(1)
    expect(screen.getByText('Content 1')).toBeInTheDocument()
  })

  it('lets a caller prevent the internal toggle', async () => {
    const user = userEvent.setup()
    render(
      <Accordion type="single">
        <AccordionItem value="item-1">
          <AccordionTrigger onClick={(event) => event.preventDefault()}>Section 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>,
    )

    await user.click(screen.getByRole('button', { name: /Section 1/i }))
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument()
  })

  it('supports controlled single-value operation', async () => {
    const user = userEvent.setup()

    function ControlledAccordion() {
      const [value, setValue] = useState('item-1')
      return (
        <Accordion type="single" value={value} onValueChange={setValue}>
          <AccordionItem value="item-1">
            <AccordionTrigger>Section 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Section 2</AccordionTrigger>
            <AccordionContent>Content 2</AccordionContent>
          </AccordionItem>
        </Accordion>
      )
    }

    render(<ControlledAccordion />)
    expect(screen.getByText('Content 1')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Section 2/i }))
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument()
    expect(screen.getByText('Content 2')).toBeInTheDocument()
  })

  it('throws helpful error if AccordionTrigger is used outside Accordion', () => {
    expectProviderError(
      () => render(<AccordionTrigger>Orphan</AccordionTrigger>),
      '<AccordionTrigger> must be used inside an <Accordion> provider.',
      'AccordionTrigger',
    )
  })

  it('protects structural props from being overridden by caller', async () => {
    const user = userEvent.setup()
    render(
      <Accordion type="single">
        <AccordionItem value="item-1">
          <AccordionTrigger type="submit" id="custom-trigger-id">
            Section 1
          </AccordionTrigger>
          <AccordionContent role="alert">Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>,
    )

    const trigger = screen.getByRole('button', { name: /Section 1/i })
    // type="button" should win over type="submit"
    expect(trigger).toHaveAttribute('type', 'button')
    // Generated ID should win over custom ID
    expect(trigger.id).not.toBe('custom-trigger-id')

    await user.click(trigger)
    // Content region role should be protected
    const content = screen.getByRole('region')
    expect(content).toBeInTheDocument()
    expect(content).toHaveAttribute('aria-labelledby', trigger.id)
  })
})
