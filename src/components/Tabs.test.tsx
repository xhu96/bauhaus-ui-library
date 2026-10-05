import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs'
import { useState } from 'react'

describe('Tabs', () => {
  it.each([
    [undefined, 'horizontal'],
    ['horizontal', 'horizontal'],
    ['vertical', 'vertical'],
  ] as const)(
    'exposes the %s orientation and protects it from conflicting list props',
    (orientation, expected) => {
      render(
        <Tabs orientation={orientation} defaultValue="profile">
          <TabsList aria-orientation={expected === 'vertical' ? 'horizontal' : 'vertical'}>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>
        </Tabs>,
      )
      expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', expected)
    },
  )

  it('uses Up/Down in vertical tabs to activate, skip disabled tabs, and wrap independently of RTL', async () => {
    const user = userEvent.setup()
    render(
      <Tabs orientation="vertical" defaultValue="first" dir="rtl">
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
    const third = screen.getByRole('tab', { name: 'Third' })
    first.focus()
    await user.keyboard('{ArrowDown}')
    expect(third).toHaveFocus()
    expect(third).toHaveAttribute('tabindex', '0')
    expect(third).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel 3')

    await user.keyboard('{ArrowDown}')
    expect(first).toHaveFocus()
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel 1')
    await user.keyboard('{ArrowUp}')
    expect(third).toHaveFocus()
    await user.keyboard('{Home}')
    expect(first).toHaveFocus()
    await user.keyboard('{End}')
    expect(third).toHaveFocus()
  })

  it.each([
    ['horizontal', ['ArrowUp', 'ArrowDown']],
    ['vertical', ['ArrowLeft', 'ArrowRight']],
  ] as const)(
    'leaves arrows on the other axis available for native behavior in %s tabs',
    (orientation, keys) => {
      render(
        <Tabs orientation={orientation} defaultValue="first">
          <TabsList>
            <TabsTrigger value="first">First</TabsTrigger>
            <TabsTrigger value="second">Second</TabsTrigger>
          </TabsList>
        </Tabs>,
      )
      const first = screen.getByRole('tab', { name: 'First' })
      first.focus()
      for (const key of keys) {
        expect(fireEvent.keyDown(first, { key })).toBe(true)
        expect(first).toHaveFocus()
        expect(first).toHaveAttribute('aria-selected', 'true')
      }
    },
  )

  it('lets a caller prevent vertical arrow navigation', async () => {
    const user = userEvent.setup()
    render(
      <Tabs orientation="vertical" defaultValue="first">
        <TabsList>
          <TabsTrigger value="first" onKeyDown={(event) => event.preventDefault()}>
            First
          </TabsTrigger>
          <TabsTrigger value="second">Second</TabsTrigger>
        </TabsList>
      </Tabs>,
    )
    const first = screen.getByRole('tab', { name: 'First' })
    first.focus()
    await user.keyboard('{ArrowDown}')
    expect(first).toHaveFocus()
    expect(first).toHaveAttribute('aria-selected', 'true')
  })

  it('updates navigation when orientation changes without resetting selection or retained drafts', async () => {
    const user = userEvent.setup()
    const view = (orientation: 'horizontal' | 'vertical') => (
      <Tabs orientation={orientation} defaultValue="first">
        <TabsList>
          <TabsTrigger value="first">First</TabsTrigger>
          <TabsTrigger value="second">Second</TabsTrigger>
        </TabsList>
        <TabsContent value="first" keepMounted>
          <input aria-label="Draft" defaultValue="Alice" />
        </TabsContent>
        <TabsContent value="second">Panel 2</TabsContent>
      </Tabs>
    )
    const { rerender } = render(view('horizontal'))
    const draft = screen.getByRole('textbox', { name: 'Draft' })
    await user.type(draft, ' Smith')
    const first = screen.getByRole('tab', { name: 'First' })
    first.focus()
    rerender(view('vertical'))
    expect(first).toHaveFocus()
    expect(first).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical')
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('tab', { name: 'Second' })).toHaveFocus()

    rerender(view('horizontal'))
    expect(screen.getByRole('tab', { name: 'Second' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'horizontal')
    await user.keyboard('{ArrowLeft}')
    expect(first).toHaveFocus()
    expect(screen.getByRole('textbox', { name: 'Draft' })).toBe(draft)
    expect(draft).toHaveValue('Alice Smith')
  })

  it('preserves uncontrolled inputs and local component state with keepMounted', async () => {
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
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" keepMounted>
          <Draft />
        </TabsContent>
        <TabsContent value="security" keepMounted>
          Security settings
        </TabsContent>
      </Tabs>,
    )
    const input = screen.getByRole('textbox', { name: 'Display name' })
    await user.clear(input)
    await user.type(input, 'Anni')
    await user.click(screen.getByRole('button', { name: 'Edits: 0' }))
    await user.click(screen.getByRole('tab', { name: 'Security' }))

    expect(input).toBeInTheDocument()
    expect(input).not.toBeVisible()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'Profile' }))
    expect(screen.getByRole('textbox', { name: 'Display name' })).toBe(input)
    expect(input).toHaveValue('Anni')
    expect(screen.getByRole('button', { name: 'Edits: 1' })).toBeVisible()
  })

  it('keeps inactive retained panels hidden and out of keyboard navigation despite caller display props', async () => {
    const user = userEvent.setup()
    render(
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" keepMounted>
          <input aria-label="Name" />
        </TabsContent>
        <TabsContent
          value="security"
          keepMounted
          hidden={false}
          className="bui-flex"
          style={{ display: 'flex' }}
        >
          <input aria-label="Secret" />
        </TabsContent>
        <button>After tabs</button>
      </Tabs>,
    )
    const inactive = screen
      .getByRole('textbox', { name: 'Secret', hidden: true })
      .closest('[role="tabpanel"]')!
    expect(inactive).toHaveAttribute('hidden')
    expect(inactive).toHaveAttribute('tabindex', '-1')
    expect(inactive).toHaveStyle({ display: 'none' })
    expect(inactive).not.toHaveClass('bui-animate-fade-in')
    expect(screen.getAllByRole('tabpanel')).toHaveLength(1)

    screen.getByRole('textbox', { name: 'Name' }).focus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'After tabs' })).toHaveFocus()

    await user.click(screen.getByRole('tab', { name: 'Security' }))
    expect(inactive).not.toHaveAttribute('hidden')
    expect(inactive).toHaveStyle({ display: 'flex' })
    expect(inactive).toHaveAttribute('tabindex', '0')
    expect(screen.getByRole('textbox', { name: 'Secret' })).toBeVisible()
  })

  it('still unmounts inactive panels and resets their uncontrolled state by default', async () => {
    const user = userEvent.setup()
    render(
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <input aria-label="Name" defaultValue="Alice" />
        </TabsContent>
        <TabsContent value="security">Security settings</TabsContent>
      </Tabs>,
    )
    const input = screen.getByRole('textbox', { name: 'Name' })
    await user.type(input, ' Smith')
    await user.click(screen.getByRole('tab', { name: 'Security' }))
    expect(input).not.toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'Profile' }))
    expect(screen.getByRole('textbox', { name: 'Name' })).not.toBe(input)
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('Alice')
  })

  it('repairs selection when a nested component removes its trigger without rerendering Tabs', async () => {
    function DynamicTrigger() {
      const [visible, setVisible] = useState(true)
      return (
        <>
          <button onClick={() => setVisible(false)}>Remove selected</button>
          {visible && <TabsTrigger value="a">A</TabsTrigger>}
        </>
      )
    }
    render(
      <Tabs defaultValue="a">
        <TabsList>
          <DynamicTrigger />
          <TabsTrigger value="b">B</TabsTrigger>
        </TabsList>
        <TabsContent value="b">Panel B</TabsContent>
      </Tabs>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Remove selected' }))
    expect(screen.getByRole('tab', { name: 'B' })).toHaveAttribute('tabindex', '0')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel B')
  })
  it('selects the first enabled tab and clears selection when all are disabled', () => {
    const view = (allDisabled: boolean) => (
      <Tabs>
        <TabsList>
          <TabsTrigger value="a" disabled>
            A
          </TabsTrigger>
          <TabsTrigger value="b" disabled={allDisabled}>
            B
          </TabsTrigger>
        </TabsList>
        <TabsContent value="a">Panel A</TabsContent>
        <TabsContent value="b">Panel B</TabsContent>
      </Tabs>
    )
    const { rerender } = render(view(false))
    expect(screen.getByRole('tab', { name: 'B' })).toHaveAttribute('tabindex', '0')
    expect(screen.getByRole('tab', { name: 'B' })).toHaveAttribute('aria-selected', 'true')
    rerender(view(true))
    for (const tab of screen.getAllByRole('tab')) {
      expect(tab).toHaveAttribute('tabindex', '-1')
      expect(tab).toHaveAttribute('aria-selected', 'false')
    }
    expect(screen.queryByRole('tabpanel')).not.toBeInTheDocument()
    rerender(view(false))
    expect(screen.getByRole('tab', { name: 'B' })).toHaveAttribute('tabindex', '0')
  })

  it('falls back when the selected trigger is disabled or removed', () => {
    const change = vi.fn()
    const view = (keys: string[], disabled?: string) => (
      <Tabs defaultValue="b" onValueChange={change}>
        <TabsList>
          {keys.map((key) => (
            <TabsTrigger key={key} value={key} disabled={disabled === key}>
              {key}
            </TabsTrigger>
          ))}
        </TabsList>
        {keys.map((key) => (
          <TabsContent key={key} value={key}>
            Panel {key}
          </TabsContent>
        ))}
      </Tabs>
    )
    const { rerender } = render(view(['a', 'b', 'c']))
    rerender(view(['a', 'b', 'c'], 'b'))
    expect(screen.getByRole('tab', { name: 'a' })).toHaveAttribute('aria-selected', 'true')
    rerender(view(['c', 'b']))
    expect(screen.getByRole('tab', { name: 'c' })).toHaveAttribute('tabindex', '0')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel c')
    expect(change).not.toHaveBeenCalled()
  })

  it('uses live DOM order after triggers are reordered', async () => {
    const view = (keys: string[]) => (
      <Tabs defaultValue="a">
        <TabsList>
          {keys.map((key) => (
            <TabsTrigger key={key} value={key}>
              {key}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    )
    const { rerender } = render(view(['a', 'b', 'c']))
    rerender(view(['a', 'c', 'b']))
    screen.getByRole('tab', { name: 'a' }).focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'c' })).toHaveFocus()
  })

  it('keeps controlled selection while providing an enabled roving focus fallback', async () => {
    const change = vi.fn()
    render(
      <Tabs value="a" onValueChange={change}>
        <TabsList>
          <TabsTrigger value="a" disabled>
            A
          </TabsTrigger>
          <TabsTrigger value="b">B</TabsTrigger>
          <TabsTrigger value="c">C</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Panel A</TabsContent>
      </Tabs>,
    )
    expect(screen.getByRole('tab', { name: 'A' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'A' })).toHaveAttribute('tabindex', '-1')
    const b = screen.getByRole('tab', { name: 'B' })
    expect(b).toHaveAttribute('tabindex', '0')
    expect(change).not.toHaveBeenCalled()
    b.focus()
    await userEvent.keyboard('{End}')
    expect(screen.getByRole('tab', { name: 'C' })).toHaveFocus()
    expect(screen.getByRole('tab', { name: 'C' })).toHaveAttribute('tabindex', '0')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel A')
    expect(change).toHaveBeenCalledWith('c')
  })

  it('supports RTL arrows and prevented key handlers', async () => {
    render(
      <div dir="rtl">
        <Tabs defaultValue="b">
          <TabsList>
            <TabsTrigger value="a">A</TabsTrigger>
            <TabsTrigger value="b">B</TabsTrigger>
            <TabsTrigger value="c" onKeyDown={(e) => e.preventDefault()}>
              C
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>,
    )
    screen.getByRole('tab', { name: 'B' }).focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'A' })).toHaveFocus()
    await userEvent.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'C' })).toHaveFocus()
    await userEvent.keyboard('{Home}')
    expect(screen.getByRole('tab', { name: 'C' })).toHaveFocus()
  })

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
