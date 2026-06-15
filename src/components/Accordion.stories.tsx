import type { Meta, StoryObj } from '@storybook/react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './Accordion'

const meta = {
  title: 'Navigation/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  args: {
    children: null,
  },
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Accordion type="single" defaultValue="item-1" className="w-96">
      <AccordionItem value="item-1">
        <AccordionTrigger>What is Bauhaus?</AccordionTrigger>
        <AccordionContent>
          A German art school that combined crafts and the fine arts.
        </AccordionContent>
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
