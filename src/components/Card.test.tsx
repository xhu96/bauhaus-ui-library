import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Card, CardBody, CardDescription, CardFooter, CardHeader, CardTitle } from './Card'

describe('Card', () => {
  it('renders complete compound card structure', () => {
    render(
      <Card accent="red">
        <CardHeader>
          <CardTitle>Bauhaus Design</CardTitle>
          <CardDescription>Geometric principles in UI</CardDescription>
        </CardHeader>
        <CardBody>Content goes here</CardBody>
        <CardFooter>Footer actions</CardFooter>
      </Card>,
    )

    expect(screen.getByText('Bauhaus Design')).toBeInTheDocument()
    expect(screen.getByText('Geometric principles in UI')).toBeInTheDocument()
    expect(screen.getByText('Content goes here')).toBeInTheDocument()
    expect(screen.getByText('Footer actions')).toBeInTheDocument()
  })

  it('applies accent top border style', () => {
    const { container } = render(<Card accent="blue">Blue accented card</Card>)

    const card = container.firstChild as HTMLElement
    expect(card).toHaveStyle({ borderTop: '10px solid #21409A' })
  })

  it('supports surface variants and toggling shadow', () => {
    const { container, rerender } = render(
      <Card surface="paper" shadow={false}>
        Paper Card
      </Card>,
    )

    let card = container.firstChild as HTMLElement
    expect(card).toHaveClass('bui-bg-paper')
    expect(card).not.toHaveClass('bui-shadow-hard')

    rerender(
      <Card surface="white" shadow={true}>
        White Card
      </Card>,
    )
    card = container.firstChild as HTMLElement
    expect(card).toHaveClass('bui-bg-surface')
    expect(card).toHaveClass('bui-shadow-hard')
  })
})
