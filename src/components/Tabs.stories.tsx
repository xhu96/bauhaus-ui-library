import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs'

const meta = {
  title: 'Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  args: {
    children: null,
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
