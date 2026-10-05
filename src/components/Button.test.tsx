import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import postcss from 'postcss'
import tailwindcss from '../../scripts/tailwind-compat.mjs'
import tailwindConfig from '../../tailwind.config'
import actionSource from '../lib/actionStyles.ts?raw'
import paletteSource from '../lib/types.ts?raw'
import tokens from '../styles/tokens.css?raw'
import { Button } from './Button'

// Exercise the emitted utilities against the rendered button. This catches an
// intent choosing the wrong palette even when conflicting legacy props exist.
async function buttonColors(button: HTMLElement) {
  const css = await postcss([
    tailwindcss({ ...tailwindConfig, content: [{ raw: actionSource + paletteSource, extension: 'ts' }] }),
  ]).process(`${tokens}\n@tailwind utilities;`, { from: undefined })
  const values: Record<string, string> = {}
  const ancestors: Element[] = []
  for (let node: Element | null = button; node; node = node.parentElement) ancestors.unshift(node)
  for (const node of ancestors) {
    css.root.walkRules((rule) => {
      if (!node.matches(rule.selector)) return
      rule.walkDecls((declaration) => {
        if (node === button || declaration.prop.startsWith('--')) values[declaration.prop] = declaration.value
      })
    })
    if (node instanceof HTMLElement)
      for (const property of Array.from(node.style)) values[property] = node.style.getPropertyValue(property)
  }
  const resolve = (value: string): string =>
    value.replace(/var\((--[\w-]+)(?:,\s*([^()]+))?\)/g, (_, name: string, fallback: string) =>
      resolve(values[name] ?? fallback ?? ''),
    )
  const color = (property: string) => {
    const value = resolve(values[property] ?? '').replace(' / 1', '')
    if (value === '#0000') return 'transparent'
    if (/^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)) {
      const hex =
        value.length === 4
          ? value
              .slice(1)
              .split('')
              .map((c) => c + c)
              .join('')
          : value.slice(1)
      return `rgb(${[0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(' ')})`
    }
    return value
  }
  return { fill: color('background-color'), foreground: color('color'), height: color('height') }
}

describe('Button', () => {
  it('marks the component for the scoped library reset', () => {
    render(<Button>Reset marker</Button>)
    expect(screen.getByRole('button', { name: 'Reset marker' })).toHaveClass('bui-reset')
  })

  it('disables the native button while loading and uses the shared Bauhaus spinner', () => {
    const { container } = render(<Button isLoading>Save</Button>)

    const button = screen.getByRole('button', { name: 'Save' })
    expect(button).toBeDisabled()
    expect(button.querySelector('circle')).toHaveAttribute('stroke-dasharray', '72 28')
    expect(container.querySelector('[role="status"]')).not.toBeInTheDocument()
  })

  it('defaults to type="button" and handles clicks', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    const button = screen.getByRole('button', { name: 'Click me' })
    expect(button).toHaveAttribute('type', 'button')

    await user.click(button)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('renders left and right icons', () => {
    render(
      <Button
        leftIcon={<span data-testid="left-icon">L</span>}
        rightIcon={<span data-testid="right-icon">R</span>}
      >
        Action
      </Button>,
    )

    expect(screen.getByTestId('left-icon')).toBeInTheDocument()
    expect(screen.getByTestId('right-icon')).toBeInTheDocument()
  })

  it.each([
    ['primary', 'rgb(33 64 154)', 'rgb(255 255 255)'],
    ['secondary', 'transparent', 'rgb(28 28 28)'],
    ['destructive', 'rgb(184 30 22)', 'rgb(255 255 255)'],
  ] as const)(
    'uses %s intent even when legacy color and variant conflict',
    async (intent, fill, foreground) => {
      render(
        <Button intent={intent} color="yellow" variant="ghost">
          Semantic action
        </Button>,
      )
      const button = screen.getByRole('button', { name: 'Semantic action' })
      expect(await buttonColors(button)).toMatchObject({ fill, foreground })
      expect(button).not.toHaveAttribute('intent')
      if (intent === 'secondary') expect(button).not.toHaveClass('bui-press-hard')
    },
  )

  it.each([
    ['solid', 'yellow', 'sm', 'rgb(244 194 13)', 'rgb(28 28 28)', '2.25rem'],
    ['outline', 'blue', 'md', 'transparent', 'rgb(33 64 154)', '2.75rem'],
    ['ghost', 'red', 'lg', 'transparent', 'rgb(184 30 22)', '3.5rem'],
  ] as const)(
    'preserves legacy %s/%s/%s visuals when intent is absent',
    async (variant, color, size, fill, foreground, height) => {
      render(
        <Button variant={variant} color={color} size={size}>
          Legacy action
        </Button>,
      )
      expect(await buttonColors(screen.getByRole('button', { name: 'Legacy action' }))).toEqual({
        fill,
        foreground,
        height,
      })
    },
  )

  it('allows semantic action colors to be themed without changing the intended hierarchy', async () => {
    render(
      <section style={{ '--bui-action-primary-fill': '21 44 112' } as React.CSSProperties}>
        <Button intent="primary">Themed action</Button>
      </section>,
    )
    expect((await buttonColors(screen.getByRole('button', { name: 'Themed action' }))).fill).toBe(
      'rgb(21 44 112)',
    )
  })
})
