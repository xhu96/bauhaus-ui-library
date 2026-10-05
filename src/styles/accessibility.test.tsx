import { render, screen } from '@testing-library/react'
import postcss, { type Root, type Rule } from 'postcss'
import tailwindcss from '../../scripts/tailwind-compat.mjs'
import { beforeAll, describe, expect, it } from 'vitest'
import tailwindConfig from '../../tailwind.config'
import globals from './globals.css?raw'
import tokens from './tokens.css?raw'
import { Button } from '../components/Button'
import { Spinner } from '../components/Spinner'
import { Switch } from '../components/Switch'
import { Checkbox } from '../components/Checkbox'
import { Radio, RadioGroup } from '../components/Radio'
import { Alert } from '../components/Alert'

let css: Root
beforeAll(async () => {
  const result = await postcss([
    tailwindcss({
      ...tailwindConfig,
      content: [
        ...(Array.isArray(tailwindConfig.content)
          ? tailwindConfig.content
          : (tailwindConfig.content?.files ?? [])),
        {
          raw: 'bui-reset bui-blur-sm bui-ring-2 bui-shadow-hard bui-shadow-hard-red bui-shadow-hard-blue bui-shadow-hard-coal bui-tabular-nums bui-rounded-none bui-font-sans bui-font-display bui-font-mono',
          extension: 'html',
        },
      ],
    }),
  ]).process(globals.replace("@import './tokens.css';", tokens), {
    from: `${process.cwd()}/src/styles/globals.css`,
  })
  css = result.root
})

function matches(rule: Rule, el: Element, pseudo = '') {
  return rule.selectors.some((selector) => {
    if (/::(before|after)/.test(selector)) {
      if (!pseudo || !selector.endsWith(pseudo)) return false
      selector = selector.slice(0, -pseudo.length)
    } else if (pseudo) return false
    try {
      return el.matches(selector)
    } catch {
      return false
    }
  })
}

// Apply generated declarations in source order, inheriting custom properties.
// These tests check the emitted cascade; real layout/media emulation is Task 4.
function declarations(el: Element, pseudo = '', reduced = false): Record<string, string> {
  const inherited = pseudo ? declarations(el) : el.parentElement ? declarations(el.parentElement) : {}
  const result: Record<string, string> = Object.fromEntries(
    Object.entries(inherited).filter(([key]) => key.startsWith('--')),
  )
  css.walkRules((rule) => {
    if (rule.parent?.type === 'atrule') {
      if (
        rule.parent.name !== 'media' ||
        rule.parent.params !== '(prefers-reduced-motion: reduce)' ||
        !reduced
      )
        return
    }
    if (matches(rule, el, pseudo))
      rule.walkDecls((decl) => {
        result[decl.prop] = decl.value
      })
  })
  if (!pseudo && el instanceof HTMLElement) {
    for (const property of Array.from(el.style)) result[property] = el.style.getPropertyValue(property)
  }
  return result
}

function resolve(value: string, vars: Record<string, string>): string {
  const start = value.indexOf('var(')
  if (start === -1) return value
  let end = start + 4
  let depth = 1
  for (; end < value.length && depth; end++) {
    if (value[end] === '(') depth++
    if (value[end] === ')') depth--
  }
  const argumentsText = value.slice(start + 4, end - 1)
  const comma = argumentsText.indexOf(',')
  const name = (comma === -1 ? argumentsText : argumentsText.slice(0, comma)).trim()
  const fallback = comma === -1 ? undefined : argumentsText.slice(comma + 1).trim()
  if (fallback === undefined) expect(vars, `Missing ${name} in ${value}`).toHaveProperty(name)
  const customValue = vars[name] === 'initial' ? undefined : vars[name]
  const replacement = resolve(customValue ?? fallback ?? '', vars)
  return resolve(value.slice(0, start) + replacement + value.slice(end), vars)
}

function contrast(a: string, b: string) {
  const luminance = (rgb: string) =>
    rgb
      .split(' ')
      .map(Number)
      .map((v) => v / 255)
      .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
      .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0)
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (values[0] + 0.05) / (values[1] + 0.05)
}

describe('distributed accessibility CSS', () => {
  it.each(['light', 'dark'] as const)(
    'retains fixed shadow colors in %s and isolates them from host shadow variables',
    (theme) => {
      const { container } = render(
        <div data-bui-theme={theme} style={{ '--tw-shadow-color': 'magenta' } as React.CSSProperties}>
          <span className="bui-reset bui-shadow-hard-red" />
          <span className="bui-reset bui-shadow-hard-blue" />
          <span className="bui-reset bui-shadow-hard-coal" />
          <span className="bui-reset bui-shadow-hard" />
        </div>,
      )
      const fixtures = container.querySelectorAll('span')
      for (const [index, expected] of [
        '#e63329',
        '#21409a',
        '#1c1c1c',
        theme === 'dark' ? 'rgb(243 239 230)' : 'rgb(28 28 28)',
      ].entries()) {
        const values = declarations(fixtures[index])
        const shadow = resolve(values['box-shadow'], values).toLowerCase()
        expect(shadow).toContain(expected)
        expect(shadow).not.toContain('magenta')
      }
    },
  )

  it('resolves transforms, rings, shadows, filters and numeric variants without host Preflight', () => {
    const { container } = render(
      <>
        <Button>Press</Button>
        <Switch aria-label="Switch" defaultChecked />
        <span className="bui-reset bui-blur-sm bui-ring-2 bui-shadow-hard bui-tabular-nums" />
      </>,
    )
    const button = screen.getByRole('button')
    const knob = screen.getByRole('switch').nextElementSibling!.firstElementChild!
    const fixture = container.lastElementChild!
    for (const el of [button, knob, fixture]) {
      const vars = declarations(el)
      for (const name of [
        '--tw-translate-x',
        '--tw-translate-y',
        '--tw-rotate',
        '--tw-skew-x',
        '--tw-skew-y',
        '--tw-scale-x',
        '--tw-scale-y',
        '--tw-ring-shadow',
        '--tw-ring-offset-shadow',
        '--tw-shadow',
        '--tw-shadow-colored',
      ]) {
        expect(vars, name).toHaveProperty(name)
      }
      for (const property of ['transform', 'box-shadow', 'filter', 'font-variant-numeric']) {
        if (vars[property]) expect(resolve(vars[property], vars)).not.toContain('var(')
      }
      for (const pseudo of ['::before', '::after']) {
        const defaults: Record<string, string> = {}
        css.walkRules((rule) => {
          if (matches(rule, el, pseudo))
            rule.walkDecls((decl) => {
              defaults[decl.prop] = decl.value
            })
        })
        expect(defaults['--tw-skew-x']).toBe('0')
        expect(defaults['--tw-scale-x']).toBe('1')
        expect(defaults['--tw-ring-shadow']).toBe('0 0 #0000')
      }
    }
    expect(declarations(knob)['--tw-translate-x']).toBe('1.5rem')
  })

  it('does not reset host elements or apply unprefixed utilities', () => {
    const { container } = render(
      <div>
        <button className="flex hidden host-animation">Host</button>
        <input />
        <h1>Heading</h1>
      </div>,
    )
    for (const el of container.querySelectorAll('*')) {
      const hostStyles = Object.keys(declarations(el)).filter((name) => !name.startsWith('--'))
      expect(hostStyles).toEqual([])
      expect(Object.keys(declarations(el)).filter((name) => name.startsWith('--tw-'))).toEqual([])
      for (const pseudo of ['::before', '::after']) {
        expect(Object.keys(declarations(el, pseudo)).filter((name) => !name.startsWith('--'))).toEqual([])
      }
    }
  })

  it('stops real Spinner, Switch and owned pseudo-element motion while retaining loading status', () => {
    const { container } = render(
      <>
        <Spinner />
        <Switch aria-label="Switch" />
        <span className="host-animation">Host</span>
      </>,
    )
    const spinner = container.querySelector('svg')!
    const track = screen.getByRole('switch').nextElementSibling!
    for (const el of [spinner, track, track.firstElementChild!]) {
      expect(declarations(el, '', true)['animation']).toBe('none')
      const duration = declarations(el, '', true)['transition-duration']
      expect(duration).toMatch(/ms$/)
      expect(parseFloat(duration)).toBe(0.01)
      expect(declarations(el, '::before', true)['animation']).toBe('none')
    }
    expect(declarations(container.querySelector('.host-animation')!, '', true)['animation']).toBeUndefined()
    expect(screen.getByRole('status')).toHaveAccessibleName('Loading')
    expect(spinner.querySelector('circle')).toHaveAttribute('stroke', 'currentColor')
  })

  it('supports light inside dark and dark inside light, including legacy .dark', () => {
    const { container } = render(
      <div className="dark">
        <span data-testid="legacy" />
        <div data-bui-theme="light">
          <span data-testid="light" />
          <div data-bui-theme="dark">
            <span data-testid="dark" />
          </div>
        </div>
      </div>,
    )
    const get = (id: string) => declarations(container.querySelector(`[data-testid="${id}"]`)!)
    expect(get('legacy')['--bui-paper']).toBe('22 20 18')
    expect(get('light')['--bui-paper']).toBe('243 239 230')
    expect(get('dark')['--bui-paper']).toBe('22 20 18')
    expect(get('light')['--bui-blue-ink']).toBe('33 64 154')
    expect(get('dark')['--bui-blue-ink']).toBe('157 176 224')
    container.querySelector('[data-bui-theme="light"]')!.classList.add('dark')
    expect(get('light')['--bui-paper']).toBe('243 239 230')
  })

  it.each(['light', 'dark'])(
    'gives %s foregrounds and focus sufficient contrast against all theme surfaces',
    (theme) => {
      render(
        <div data-bui-theme={theme}>
          <Button variant="outline" color="blue">
            Blue
          </Button>
          <Spinner color="blue" />
          <Alert title="Info" />
          <Checkbox label="Check" />
          <RadioGroup>
            <Radio value="a" label="Radio" />
          </RadioGroup>
          <Switch aria-label="Switch" />
        </div>,
      )
      const button = screen.getByRole('button', { name: 'Blue' })
      const vars = declarations(button)
      for (const surface of ['--bui-paper', '--bui-paper-dark', '--bui-surface']) {
        for (const color of ['blue', 'red', 'yellow']) {
          expect(contrast(vars[`--bui-${color}-ink`], vars[surface])).toBeGreaterThanOrEqual(4.5)
        }
        expect(contrast(vars['--bui-focus'], vars[surface])).toBeGreaterThanOrEqual(3)
      }
      expect(vars.color).toContain('--bui-blue-ink')
      const spinner = screen.getByRole('status').querySelector('svg')!
      expect(declarations(spinner).color).toContain('--bui-blue-ink')
      expect(spinner.querySelector('circle')).toHaveAttribute('stroke', 'currentColor')
      const icon = screen.getByRole('alert').querySelector('span')!
      expect(declarations(icon).color).toContain('--bui-blue-ink')
      button.focus()
      expect(declarations(button).outline).toContain('--bui-focus')
      for (const input of [
        screen.getByRole('checkbox'),
        screen.getByRole('radio'),
        screen.getByRole('switch'),
      ]) {
        input.focus()
        expect(declarations(input.nextElementSibling!)['outline-color']).toContain('--bui-focus')
      }
    },
  )

  it('wires the small customization token set to generated utilities', () => {
    const { container } = render(
      <>
        <Button color="red">Press</Button>
        <span className="bui-reset bui-rounded-none bui-font-sans" />
        <span className="bui-reset bui-font-mono" />
      </>,
    )
    const button = declarations(screen.getByRole('button'))
    expect(button['border-width']).toContain('--bui-border-width')
    expect(button['font-family']).toContain('--bui-font-display')
    expect(button['--tw-shadow']).toContain('--bui-shadow-offset')
    expect(button['transition-duration']).toContain('--bui-motion-duration')
    expect(button['background-color']).toContain('--bui-red-dark')
    expect(contrast(button['--bui-red-dark'], '255 255 255')).toBeGreaterThanOrEqual(4.5)
    expect(button['border-radius']).toContain('--bui-radius')
    expect(declarations(container.querySelector('.bui-rounded-none')!)['border-radius']).toContain(
      '--bui-radius',
    )
    for (const font of ['sans', 'mono'])
      expect(declarations(container.querySelector(`.bui-font-${font}`)!)['font-family']).toContain(
        `--bui-font-${font}`,
      )
  })

  it('applies scoped consumer token overrides through compiled declarations', () => {
    const { container } = render(
      <div>
        <Button color="blue">Custom</Button>
      </div>,
    )
    const scope = container.firstElementChild as HTMLElement
    const custom: Record<string, string> = {
      '--bui-font-display': 'serif',
      '--bui-border-width': '2px',
      '--bui-radius': '5px',
      '--bui-shadow-offset': '8px',
      '--bui-motion-duration': '200ms',
      '--bui-blue': '20 40 100',
      '--bui-blue-dark': '10 20 50',
    }
    for (const [name, value] of Object.entries(custom)) scope.style.setProperty(name, value)
    const button = screen.getByRole('button')
    const computed = declarations(button)
    expect(resolve(computed['font-family'], computed)).toBe('serif')
    expect(resolve(computed['border-width'], computed)).toBe('2px')
    expect(resolve(computed['border-radius'], computed)).toBe('5px')
    expect(resolve(computed['--tw-shadow'], computed)).toContain('8px 8px')
    expect(resolve(computed['transition-duration'], computed)).toBe('200ms')
    expect(resolve(computed['background-color'], computed)).toBe('rgb(20 40 100 / 1)')
    expect(computed['--bui-blue-ink']).toBe('33 64 154')
    let hoverColor = ''
    css.walkRules((rule) => {
      if (rule.selector.includes(':hover') && button.matches(rule.selector.replace(/:hover/g, ''))) {
        rule.walkDecls('background-color', (decl) => {
          hoverColor = decl.value
        })
      }
    })
    expect(resolve(hoverColor, computed)).toBe('rgb(10 20 50 / 1)')
  })
})
