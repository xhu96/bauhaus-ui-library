import postcss, { type Root } from 'postcss'
import { describe, expect, it } from 'vitest'
import bauhausTailwind from '../../scripts/tailwind-compat.mjs'
import config from '../../tailwind.config'

async function compile(raw: string): Promise<Root> {
  const result = await postcss([
    bauhausTailwind({ ...config, content: [{ raw, extension: 'html' }] }),
  ]).process('@tailwind utilities;', { from: undefined })
  return result.root
}

function value(css: Root, className: string, property: string): string {
  const node = document.createElement('div')
  node.className = className
  let result = ''
  css.walkRules((rule) => {
    if (!node.matches(rule.selector)) return
    rule.walkDecls(property, (declaration) => {
      result = declaration.value
    })
  })
  return result
}

describe('Tailwind 4 legacy utility compatibility', () => {
  it('emits existing prefixed, negative and arbitrary utilities without unowned global resets', async () => {
    const css = await compile(
      '<div class="bui-flex -bui-translate-x-[1px] bui-bg-ink/10 bui-rounded-none bui-h-11 [overflow-wrap:anywhere]"></div>',
    )
    expect(value(css, 'bui-flex', 'display')).toBe('flex')
    expect(value(css, '[overflow-wrap:anywhere]', 'overflow-wrap')).toBe('anywhere')
    expect(value(css, '-bui-translate-x-[1px]', '--tw-translate-x')).toBe('-1px')
    expect(value(css, 'bui-h-11', 'height')).toBe('2.75rem')
    expect(value(css, 'bui-rounded-none', 'border-radius')).toBe('var(--bui-radius)')
    expect(value(css, 'bui-bg-ink/10', 'background-color')).toContain('--bui-ink')
    const globalRules: string[] = []
    css.walkRules((rule) => {
      if (rule.parent?.type === 'atrule' && rule.parent.name.endsWith('keyframes')) return
      if (
        rule.selector
          .split(',')
          .some((selector) => /^(\*|html|body|:root|:host)(?:\s|$|:)/.test(selector.trim()))
      )
        globalRules.push(rule.selector)
    })
    expect(globalRules).toEqual([])
  })

  it('preserves hover, disabled and native peer selectors in their original public spelling', async () => {
    const css = await compile(
      '<input class="bui-peer"/><span class="peer-checked:bui-opacity-100 hover:bui-text-white disabled:bui-opacity-50"></span>',
    )
    const input = document.createElement('input')
    input.type = 'checkbox'
    input.className = 'bui-peer'
    const span = document.createElement('span')
    span.className = 'peer-checked:bui-opacity-100'
    const host = document.createElement('div')
    host.append(input, span)
    input.checked = true
    let checked = false
    let hover = false
    let disabled = false
    css.walkRules((rule) => {
      rule.walkDecls((declaration) => {
        if (span.matches(rule.selector) && declaration.prop === 'opacity' && declaration.value === '1')
          checked = true
        if (rule.selector.includes(':hover') && declaration.prop === 'color') hover = true
        if (
          rule.selector.includes(':disabled') &&
          declaration.prop === 'opacity' &&
          Number(declaration.value) === 0.5
        )
          disabled = true
      })
    })
    expect(checked).toBe(true)
    expect(hover).toBe(true)
    expect(disabled).toBe(true)
  })

  it('keeps both public names when compatibility aliases share a compiler candidate', async () => {
    const css = await compile(
      'bui-outline-none bui-outline-hidden bui-rounded-none bui-rounded-[var(--bui-radius)]',
    )
    for (const name of ['bui-outline-none', 'bui-outline-hidden'])
      expect(value(css, name, 'outline')).toMatch(/transparent|#0000/)
    for (const name of ['bui-rounded-none', 'bui-rounded-[var(--bui-radius)]'])
      expect(value(css, name, 'border-radius')).toBe('var(--bui-radius)')
  })

  it('composes translate, scale and rotation using isolated owned defaults', async () => {
    const css = await compile('bui-translate-x-6 bui-scale-95 bui-rotate-45')
    const transform = value(css, 'bui-translate-x-6 bui-scale-95 bui-rotate-45', 'transform')
    expect(transform).toContain('var(--tw-translate-x)')
    expect(transform).toContain('var(--tw-rotate)')
    expect(transform).toContain('var(--tw-scale-x)')
    expect(value(css, 'bui-translate-x-6', 'translate')).toBe('')
    expect(value(css, 'bui-scale-95', 'scale')).toBe('')
    expect(value(css, 'bui-rotate-45', 'rotate')).toBe('')
    expect(value(css, 'bui-reset', '--tw-scale-x')).toBe('1')
    expect(value(css, 'host', '--tw-scale-x')).toBe('')
    const properties: string[] = []
    css.walkAtRules('property', (rule) => {
      properties.push(rule.params)
    })
    expect(properties).toEqual([])
  })

  it('reports scanned files and source globs so edits and newly added utilities trigger HMR', async () => {
    const result = await postcss([bauhausTailwind(config)]).process('@tailwind utilities;', {
      from: `${process.cwd()}/src/styles/globals.css`,
    })
    expect(result.messages).toContainEqual(
      expect.objectContaining({ type: 'dependency', file: `${process.cwd()}/src/components/Button.tsx` }),
    )
    expect(result.messages).toContainEqual(
      expect.objectContaining({
        type: 'dir-dependency',
        dir: `${process.cwd()}/src`,
        glob: expect.stringContaining('tsx'),
      }),
    )
    expect(result.root.first?.source?.input.file).toBe(`${process.cwd()}/src/styles/globals.css`)
  })
})
