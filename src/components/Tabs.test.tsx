import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs'

describe('Tabs', () => {
  it('switches tabs on trigger click', async () => {
    const user = userEvent.setup()
    const handleValueChange = vi.fn()
    render(
      <Tabs defaultValue="account" onValueChange={handleValueChange}>
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">Account settings</TabsContent>
        <TabsContent value="password">Change your password</TabsContent>
      </Tabs>,
    )

    expect(screen.getByText('Account settings')).toBeInTheDocument()
    expect(screen.queryByText('Change your password')).not.toBeInTheDocument()

    const passwordTab = screen.getByRole('tab', { name: 'Password' })
    await user.click(passwordTab)

    expect(screen.queryByText('Account settings')).not.toBeInTheDocument()
    expect(screen.getByText('Change your password')).toBeInTheDocument()
    expect(handleValueChange).toHaveBeenCalledWith('password')
  })

  it('navigates tabs with left and right arrow keys', async () => {
    const user = userEvent.setup()
    render(
      <Tabs defaultValue="first">
        <TabsList>
          <TabsTrigger value="first">First</TabsTrigger>
          <TabsTrigger value="second">Second</TabsTrigger>
          <TabsTrigger value="third">Third</TabsTrigger>
        </TabsList>
        <TabsContent value="first">Panel 1</TabsContent>
        <TabsContent value="second">Panel 2</TabsContent>
        <TabsContent value="third">Panel 3</TabsContent>
      </Tabs>,
    )

    const firstTab = screen.getByRole('tab', { name: 'First' })
    firstTab.focus()

    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Second' })).toHaveFocus()
    expect(screen.getByText('Panel 2')).toBeInTheDocument()

    await user.keyboard('{ArrowLeft}')
    expect(screen.getByRole('tab', { name: 'First' })).toHaveFocus()
    expect(screen.getByText('Panel 1')).toBeInTheDocument()
  })

  it('preserves caller-provided onClick handler on trigger', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(
      <Tabs defaultValue="one">
        <TabsList>
          <TabsTrigger value="one" onClick={handleClick}>
            One
          </TabsTrigger>
        </TabsList>
        <TabsContent value="one">Panel One</TabsContent>
      </Tabs>,
    )

    await user.click(screen.getByRole('tab', { name: 'One' }))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('lets a caller prevent the internal tab change', async () => {
    const user = userEvent.setup()
    render(
      <Tabs defaultValue="one">
        <TabsList>
          <TabsTrigger value="one">One</TabsTrigger>
          <TabsTrigger value="two" onClick={(event) => event.preventDefault()}>
            Two
          </TabsTrigger>
        </TabsList>
        <TabsContent value="one">Panel One</TabsContent>
        <TabsContent value="two">Panel Two</TabsContent>
      </Tabs>,
    )

    await user.click(screen.getByRole('tab', { name: 'Two' }))

    expect(screen.getByText('Panel One')).toBeInTheDocument()
    expect(screen.queryByText('Panel Two')).not.toBeInTheDocument()
  })

  it('supports Home and End keyboard navigation', async () => {
    const user = userEvent.setup()
    render(
      <Tabs defaultValue="second">
        <TabsList>
          <TabsTrigger value="first">First</TabsTrigger>
          <TabsTrigger value="second">Second</TabsTrigger>
          <TabsTrigger value="third">Third</TabsTrigger>
        </TabsList>
        <TabsContent value="first">Panel 1</TabsContent>
        <TabsContent value="second">Panel 2</TabsContent>
        <TabsContent value="third">Panel 3</TabsContent>
      </Tabs>,
    )

    const second = screen.getByRole('tab', { name: 'Second' })
    second.focus()
    await user.keyboard('{End}')
    expect(screen.getByRole('tab', { name: 'Third' })).toHaveFocus()
    expect(screen.getByText('Panel 3')).toBeInTheDocument()

    await user.keyboard('{Home}')
    expect(screen.getByRole('tab', { name: 'First' })).toHaveFocus()
    expect(screen.getByText('Panel 1')).toBeInTheDocument()
  })

  it('skips disabled tabs during keyboard navigation', async () => {
    const user = userEvent.setup()
    render(
      <Tabs defaultValue="first">
        <TabsList>
          <TabsTrigger value="first">First</TabsTrigger>
          <TabsTrigger value="disabled" disabled>
            Disabled
          </TabsTrigger>
          <TabsTrigger value="third">Third</TabsTrigger>
        </TabsList>
        <TabsContent value="first">Panel 1</TabsContent>
        <TabsContent value="disabled">Disabled panel</TabsContent>
        <TabsContent value="third">Panel 3</TabsContent>
      </Tabs>,
    )

    const first = screen.getByRole('tab', { name: 'First' })
    first.focus()
    await user.keyboard('{ArrowRight}')

    expect(screen.getByRole('tab', { name: 'Third' })).toHaveFocus()
    expect(screen.getByText('Panel 3')).toBeInTheDocument()
    expect(screen.queryByText('Disabled panel')).not.toBeInTheDocument()
  })

  it('auto-selects the first tab when neither value nor defaultValue is supplied', () => {
    render(
      <Tabs>
        <TabsList>
          <TabsTrigger value="tab-1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab-2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab-1">Content 1</TabsContent>
        <TabsContent value="tab-2">Content 2</TabsContent>
      </Tabs>,
    )

    const tab1 = screen.getByRole('tab', { name: 'Tab 1' })
    const tab2 = screen.getByRole('tab', { name: 'Tab 2' })

    // First tab is selected and focusable
    expect(tab1).toHaveAttribute('tabindex', '0')
    expect(tab1).toHaveAttribute('aria-selected', 'true')
    expect(tab2).toHaveAttribute('tabindex', '-1')
    expect(tab2).toHaveAttribute('aria-selected', 'false')

    // First panel content is visible
    expect(screen.getByText('Content 1')).toBeInTheDocument()
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument()
  })

  it('does not call onValueChange for automatic initial selection', () => {
    const handleValueChange = vi.fn()
    render(
      <Tabs onValueChange={handleValueChange}>
        <TabsList>
          <TabsTrigger value="first">First</TabsTrigger>
          <TabsTrigger value="second">Second</TabsTrigger>
        </TabsList>
        <TabsContent value="first">First panel</TabsContent>
        <TabsContent value="second">Second panel</TabsContent>
      </Tabs>,
    )

    expect(screen.getByRole('tab', { name: 'First' })).toHaveAttribute('aria-selected', 'true')
    expect(handleValueChange).not.toHaveBeenCalled()
  })

  it('protects structural accessibility props from being overridden', () => {
    render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a" id="custom-id" role={'link' as 'tab'} type="submit">
            Tab A
          </TabsTrigger>
        </TabsList>
        <TabsContent value="a" role={'alert' as 'tabpanel'}>
          Panel A
        </TabsContent>
      </Tabs>,
    )

    // Structural props should be protected — generated ID wins
    const trigger = screen.getByRole('tab', { name: 'Tab A' })
    expect(trigger).toHaveAttribute('type', 'button')
    expect(trigger.id).not.toBe('custom-id')

    // TabsContent panel keeps its structural role
    const panel = screen.getByRole('tabpanel')
    expect(panel).toBeInTheDocument()

    // aria-labelledby points to the generated trigger ID, not the custom one
    expect(panel).toHaveAttribute('aria-labelledby', trigger.id)
  })
})
