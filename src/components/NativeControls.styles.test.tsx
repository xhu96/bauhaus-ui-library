import { render, screen } from '@testing-library/react'
import postcss from 'postcss'
import tailwindcss from '../../scripts/tailwind-compat.mjs'
import { describe, expect, it } from 'vitest'
import tailwindConfig from '../../tailwind.config'
import checkboxSource from './Checkbox.tsx?raw'
import radioSource from './Radio.tsx?raw'
import switchSource from './Switch.tsx?raw'
import tokens from '../styles/tokens.css?raw'
import { Checkbox } from './Checkbox'
import { Radio, RadioGroup } from './Radio'
import { Switch } from './Switch'

describe('native control compiled selectors', () => {
  it.each(['ltr', 'rtl', 'nested-ltr'] as const)(
    'keeps every Switch knob inside its compiled track in %s, checked and unchecked',
    async (direction) => {
      const result = await postcss([
        tailwindcss({ ...tailwindConfig, content: [{ raw: switchSource, extension: 'tsx' }] }),
      ]).process('@tailwind utilities;', { from: undefined })
      render(
        <div dir={direction === 'ltr' ? 'ltr' : 'rtl'}>
          <div dir={direction === 'nested-ltr' ? 'ltr' : undefined}>
            {(['sm', 'md', 'lg'] as const).map((size) => (
              <Switch key={size} size={size} aria-label={size} />
            ))}
          </div>
        </div>,
      )
      const pixels = (value: string): number => {
        if (value.startsWith('var(')) {
          let resolved = ''
          postcss.parse(tokens).walkDecls(value.slice(4, -1), (decl) => {
            resolved = decl.value
          })
          return pixels(resolved)
        }
        return parseFloat(value) * (value.endsWith('rem') ? 16 : 1)
      }
      const compiledValue = (element: Element, property: string) => {
        let value = ''
        result.root.walkRules((rule) => {
          if (element.matches(rule.selector)) {
            rule.walkDecls(property, (declaration) => {
              value = declaration.value
            })
          }
        })
        return pixels(value)
      }
      for (const input of screen.getAllByRole('switch') as HTMLInputElement[]) {
        const track = input.nextElementSibling!
        const knob = track.firstElementChild!
        const width = compiledValue(track.parentElement!, 'width')
        const knobWidth = compiledValue(knob, 'width')
        const inset = compiledValue(track, 'border-width') + compiledValue(track, 'padding')
        const rtl = track.closest('[dir]')?.getAttribute('dir') === 'rtl'
        for (const checked of [false, true]) {
          input.checked = checked
          const travel = compiledValue(knob, '--tw-translate-x')
          const left = (rtl ? width - inset - knobWidth : inset) + travel
          expect(left).toBeGreaterThanOrEqual(inset)
          expect(left + knobWidth).toBeLessThanOrEqual(width - inset)
        }
      }
    },
  )

  it('emits focus outline rules matching Checkbox and Radio peers', async () => {
    const result = await postcss([
      tailwindcss({ ...tailwindConfig, content: [{ raw: checkboxSource + radioSource, extension: 'tsx' }] }),
    ]).process('@tailwind utilities;', { from: undefined })
    render(
      <>
        <Checkbox aria-label="Check" />
        <RadioGroup>
          <Radio value="a" label="Radio" />
        </RadioGroup>
      </>,
    )
    for (const input of [screen.getByRole('checkbox'), screen.getByRole('radio')]) {
      input.focus()
      let matched = false
      result.root.walkRules((rule) => {
        if (!rule.selector.includes(':focus-visible')) return
        rule.walkDecls('outline-width', (decl) => {
          if (decl.value === '3px' && input.nextElementSibling?.matches(rule.selector)) matched = true
        })
      })
      expect(matched).toBe(true)
    }
  })

  it('ties the Switch knob to native checked state even without a React render', async () => {
    const result = await postcss([
      tailwindcss({ ...tailwindConfig, content: [{ raw: switchSource, extension: 'tsx' }] }),
    ]).process('@tailwind utilities;', { from: undefined })
    const { container } = render(<Switch aria-label="Native" />)
    const input = screen.getByRole('switch') as HTMLInputElement
    const matchingTravel = () => {
      let matched = false
      result.root.walkRules((rule) => {
        if (!rule.selector.includes(':checked')) return
        rule.walkDecls('--tw-translate-x', (decl) => {
          if (decl.value === '1.5rem' && container.querySelector(rule.selector)) matched = true
        })
      })
      return matched
    }
    expect(matchingTravel()).toBe(false)
    input.checked = true
    expect(matchingTravel()).toBe(true)
    input.checked = false
    expect(matchingTravel()).toBe(false)
  })
})
