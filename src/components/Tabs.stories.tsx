import type { Meta, StoryObj } from '@storybook/react'
import { fn, within, userEvent, expect } from '@storybook/test'
import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs'

const meta = {
  title: 'Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'Controlled active tab value.',
    },
    defaultValue: {
      control: 'text',
      description: 'Initial active tab value when uncontrolled.',
    },
    onValueChange: {
      description: 'Fires with the new value whenever the active tab changes.',
    },
  },
  args: {
    children: null,
    onValueChange: fn(),
  },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-96">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">A high-level summary lives here.</TabsContent>
      <TabsContent value="details">The fine print and specifications.</TabsContent>
      <TabsContent value="reviews">What people are saying.</TabsContent>
    </Tabs>
  ),
}

function ControlledTabs() {
  const [value, setValue] = useState('one')
  return (
    <Tabs value={value} onValueChange={setValue} className="w-96">
      <TabsList>
        <TabsTrigger value="one" color="red">
          One
        </TabsTrigger>
        <TabsTrigger value="two" color="blue">
          Two
        </TabsTrigger>
        <TabsTrigger value="three" color="yellow">
          Three
        </TabsTrigger>
      </TabsList>
      <TabsContent value="one">First panel.</TabsContent>
      <TabsContent value="two">Second panel.</TabsContent>
      <TabsContent value="three">Third panel.</TabsContent>
    </Tabs>
  )
}

export const Controlled: Story = {
  render: () => <ControlledTabs />,
}

/**
 * Every BauhausColor as an active trigger, including the `ink` value that the
 * other stories never exercise.
 */
export const AllColors: Story = {
  render: () => (
    <Tabs defaultValue="ink" className="w-[28rem]">
      <TabsList>
        <TabsTrigger value="red" color="red">
          Red
        </TabsTrigger>
        <TabsTrigger value="blue" color="blue">
          Blue
        </TabsTrigger>
        <TabsTrigger value="yellow" color="yellow">
          Yellow
        </TabsTrigger>
        <TabsTrigger value="ink" color="ink">
          Ink
        </TabsTrigger>
      </TabsList>
      <TabsContent value="red">The red tab is active.</TabsContent>
      <TabsContent value="blue">The blue tab is active.</TabsContent>
      <TabsContent value="yellow">The yellow tab is active.</TabsContent>
      <TabsContent value="ink">The ink tab is active.</TabsContent>
    </Tabs>
  ),
}

/**
 * Exercises the signature roving-focus keyboard interaction: ArrowRight/ArrowLeft
 * move between triggers, activate the focused tab, and wrap around at both ends.
 */
export const KeyboardNavigation: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-96">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">A high-level summary lives here.</TabsContent>
      <TabsContent value="details">The fine print and specifications.</TabsContent>
      <TabsContent value="reviews">What people are saying.</TabsContent>
    </Tabs>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const overview = await canvas.findByRole('tab', { name: 'Overview' })
    const details = await canvas.findByRole('tab', { name: 'Details' })
    const reviews = await canvas.findByRole('tab', { name: 'Reviews' })

    // Overview starts active and is the only tab in the roving tab order.
    expect(overview).toHaveAttribute('aria-selected', 'true')
    overview.focus()
    expect(overview).toHaveFocus()

    // ArrowRight moves focus to the next trigger AND activates it.
    await userEvent.keyboard('{ArrowRight}')
    expect(details).toHaveFocus()
    expect(details).toHaveAttribute('aria-selected', 'true')
    expect(await canvas.findByRole('tabpanel')).toHaveTextContent('The fine print and specifications.')

    // ArrowLeft from the first tab wraps around to the last one.
    overview.focus()
    await userEvent.keyboard('{ArrowLeft}')
    expect(reviews).toHaveFocus()
    expect(reviews).toHaveAttribute('aria-selected', 'true')
    expect(await canvas.findByRole('tabpanel')).toHaveTextContent('What people are saying.')
  },
}
