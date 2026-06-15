import type { Meta, StoryObj } from '@storybook/react'
import { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter } from './Card'
import { Button } from './Button'

const meta = {
  title: 'Core/Card',
  component: Card,
  tags: ['autodocs'],
  args: {
    shadow: true,
    surface: 'white',
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Card {...args} className="w-80">
      <CardHeader>
        <CardTitle>Bauhaus Card</CardTitle>
        <CardDescription>A composable surface with header, body and footer.</CardDescription>
      </CardHeader>
      <CardBody>
        <p className="text-sm text-ink-soft">
          Cards group related content behind a thick ink border and a hard offset shadow.
        </p>
      </CardBody>
      <CardFooter>
        <Button size="sm" color="blue">
          Confirm
        </Button>
        <Button size="sm" variant="ghost">
          Cancel
        </Button>
      </CardFooter>
    </Card>
  ),
}

export const Accents: Story = {
  render: () => (
    <div className="flex flex-wrap gap-5">
      {(['red', 'blue', 'yellow', 'ink'] as const).map((accent) => (
        <Card key={accent} accent={accent} className="w-56">
          <CardBody>
            <CardTitle>{accent}</CardTitle>
            <CardDescription>Top accent bar in {accent}.</CardDescription>
          </CardBody>
        </Card>
      ))}
    </div>
  ),
}

export const Surfaces: Story = {
  render: () => (
    <div className="flex flex-wrap gap-5">
      <Card surface="white" className="w-56">
        <CardBody>
          <CardTitle>White</CardTitle>
          <CardDescription>White surface.</CardDescription>
        </CardBody>
      </Card>
      <Card surface="paper" className="w-56">
        <CardBody>
          <CardTitle>Paper</CardTitle>
          <CardDescription>Paper surface.</CardDescription>
        </CardBody>
      </Card>
    </div>
  ),
}

export const NoShadow: Story = {
  render: () => (
    <Card shadow={false} className="w-80">
      <CardBody>
        <CardTitle>Flat card</CardTitle>
        <CardDescription>Shadow disabled.</CardDescription>
      </CardBody>
    </Card>
  ),
}
