import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './Accordion'

describe('Accordion', () => {
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
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => {
      render(<AccordionTrigger>Orphan</AccordionTrigger>)
    }).toThrow('<AccordionTrigger> must be used inside an <Accordion> provider.')
    consoleError.mockRestore()
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
