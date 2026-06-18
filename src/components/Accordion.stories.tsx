import type { Meta, StoryObj } from '@storybook/react'
import { within, userEvent, expect } from '@storybook/test'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './Accordion'

const meta = {
  title: 'Navigation/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  args: {
    children: null,
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['single', 'multiple'],
      description: '`single` allows one open item at a time, `multiple` allows many.',
    },
    defaultValue: {
      control: 'text',
      description: 'Item value(s) open on mount. A string, or a string[] for `multiple`.',
    },
  },
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Accordion type="single" defaultValue="item-1" className="w-96">
      <AccordionItem value="item-1">
        <AccordionTrigger>What is Bauhaus?</AccordionTrigger>
        <AccordionContent>A German art school that combined crafts and the fine arts.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>When was it founded?</AccordionTrigger>
        <AccordionContent>In 1919 by Walter Gropius.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>What are its principles?</AccordionTrigger>
        <AccordionContent>Form follows function, with bold primary colors.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" defaultValue={['a', 'b']} className="w-96">
      <AccordionItem value="a">
        <AccordionTrigger>First</AccordionTrigger>
        <AccordionContent>Open by default.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Second</AccordionTrigger>
        <AccordionContent>Also open by default.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="c">
        <AccordionTrigger>Third</AccordionTrigger>
        <AccordionContent>Closed by default.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

/**
 * Args-driven: `type` and `defaultValue` are wired to meta args so the Controls
 * panel actually drives the Accordion. The fixed item set stays constant.
 */
export const Playground: Story = {
  args: {
    type: 'single',
    defaultValue: 'item-1',
  },
  render: (args) => (
    <Accordion {...args} className="w-96">
      <AccordionItem value="item-1">
        <AccordionTrigger>What is Bauhaus?</AccordionTrigger>
        <AccordionContent>A German art school that combined crafts and the fine arts.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>When was it founded?</AccordionTrigger>
        <AccordionContent>In 1919 by Walter Gropius.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>What are its principles?</AccordionTrigger>
        <AccordionContent>Form follows function, with bold primary colors.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

/**
 * No `defaultValue`: every row starts collapsed — the most common real-world
 * default state.
 */
export const AllCollapsed: Story = {
  render: () => (
    <Accordion type="single" className="w-96">
      <AccordionItem value="item-1">
        <AccordionTrigger>What is Bauhaus?</AccordionTrigger>
        <AccordionContent>A German art school that combined crafts and the fine arts.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>When was it founded?</AccordionTrigger>
        <AccordionContent>In 1919 by Walter Gropius.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>What are its principles?</AccordionTrigger>
        <AccordionContent>Form follows function, with bold primary colors.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

/**
 * Behavioral: clicking a collapsed trigger reveals its region; clicking it again
 * collapses it. Starts fully collapsed so the play function is robust.
 */
export const TogglesOpen: Story = {
  render: () => (
    <Accordion type="single" className="w-96">
      <AccordionItem value="item-1">
        <AccordionTrigger>What is Bauhaus?</AccordionTrigger>
        <AccordionContent>A German art school that combined crafts and the fine arts.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>When was it founded?</AccordionTrigger>
        <AccordionContent>In 1919 by Walter Gropius.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = await canvas.findByRole('button', { name: /what is bauhaus/i })

    // Starts collapsed.
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')

    // Click reveals the region.
    await userEvent.click(trigger)
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    const region = await canvas.findByRole('region')
    await expect(region).toBeVisible()

    // Click again collapses it.
    await userEvent.click(trigger)
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  },
}
