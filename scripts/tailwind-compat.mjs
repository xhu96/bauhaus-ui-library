import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import postcss from 'postcss'
import selectorParser from 'postcss-selector-parser'
import { compile } from 'tailwindcss'
import { Scanner } from '@tailwindcss/oxide'
import { transform, Features } from 'lightningcss'
import defaultConfig from '../tailwind.config.js'

const require = createRequire(import.meta.url)
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const theme = readFileSync(require.resolve('tailwindcss/theme.css'), 'utf8').replace(
  '@theme default',
  '@theme default inline',
)
const replacements = {
  'rounded-none': 'rounded-[var(--bui-radius)]',
  'outline-none': 'outline-hidden',
  'blur-sm': 'blur-xs',
  'shadow-sm': 'shadow-xs',
  'drop-shadow-sm': 'drop-shadow-xs',
}

function parts(candidate) {
  const result = []
  let start = 0
  let depth = 0
  for (let i = 0; i < candidate.length; i++) {
    if ('[('.includes(candidate[i])) depth++
    if ('])'.includes(candidate[i])) depth--
    if (candidate[i] === ':' && depth === 0) {
      result.push(candidate.slice(start, i))
      start = i + 1
    }
  }
  result.push(candidate.slice(start))
  return result
}

function canonical(candidate) {
  const segments = parts(candidate)
  const utility = segments.pop()
  const match = /^(-?)bui-(.+)$/.exec(utility)
  // Tailwind 3 accepted arbitrary properties without its configured prefix.
  if (!match) return /^\[[\w-]+:.+\]$/.test(utility) ? ['buitw', ...segments, utility].join(':') : null
  const name = replacements[match[2]] ?? match[2]
  return ['buitw', ...segments, `${match[1]}${name}`].join(':')
}

function collect(config) {
  const content = Array.isArray(config.content) ? config.content : (config.content?.files ?? [])
  const scanner = new Scanner({
    sources: content
      .filter((entry) => typeof entry === 'string')
      .map((pattern) => ({ base: projectRoot, pattern, negated: false })),
  })
  const candidates = scanner
    .scan()
    .concat(
      scanner.scanFiles(
        content
          .filter((entry) => typeof entry !== 'string')
          .map(({ raw, extension }) => ({ content: raw, extension: extension ?? 'html' })),
      ),
    )
  return { candidates, files: scanner.files, globs: scanner.globs }
}

const legacyTransform =
  'translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))'

function simplifyProduct(value) {
  return value.replace(
    /^calc\((-?[\d.]+)([a-z%]*) \* (-?[\d.]+)\)$/,
    (_, number, unit, multiplier) => `${Number(number) * Number(multiplier)}${unit}`,
  )
}

function legacyPeerSelectors(selectors) {
  selectors.walkPseudos((node) => {
    if (node.value !== ':is' || node.nodes.length !== 1) return
    const inner = node.nodes[0]
    const marker = inner.first
    if (
      marker?.value !== ':where' ||
      marker.nodes.length !== 1 ||
      !marker.nodes[0].nodes.some(
        (part) => part.type === 'class' && /^bui-(peer|group)(\/|$)/.test(part.value),
      )
    )
      return
    if (inner.last?.type !== 'universal' || !inner.nodes.some((part) => part.type === 'combinator')) return
    const relation = inner.clone()
    relation.first.replaceWith(...marker.nodes[0].nodes.map((part) => part.clone()))
    relation.last.remove()
    const outer = node.parent
    node.remove()
    for (const part of [...relation.nodes].reverse()) outer.prepend(part.clone())
  })
}

/** Compile the owned utility subset with Tailwind 4 while keeping bui- markup.
 * No Preflight is imported. Global @property defaults are materialized only on
 * owned reset nodes; generated selectors are translated back to the legacy API.
 */
export default function bauhausTailwind(config = defaultConfig) {
  return {
    postcssPlugin: 'bauhaus-tailwind-compat',
    async Once(root, { result }) {
      if (!root.toString().includes('@tailwind') && !root.toString().includes('@apply')) return
      const aliases = new Map()
      const candidates = []
      const sources = collect(config)
      for (const original of sources.candidates) {
        const converted = canonical(original)
        if (converted) {
          if (!aliases.has(converted)) aliases.set(converted, new Set())
          aliases.get(converted).add(original)
          candidates.push(converted)
        }
      }
      root.walkAtRules('apply', (rule) => {
        rule.params = rule.params
          .split(/\s+/)
          .map((candidate) => canonical(candidate) ?? candidate)
          .join(' ')
      })
      root.walkAtRules('tailwind', (rule) => {
        if (rule.params !== 'utilities') rule.remove()
      })
      const compiler = await compile(`${theme}\n@config "bauhaus-compat";\n${root}`, {
        base: root.source?.input.file ? dirname(root.source.input.file) : projectRoot,
        async loadModule() {
          return {
            path: resolve(projectRoot, 'tailwind.config.js'),
            base: projectRoot,
            module: { ...config, prefix: 'buitw', content: [] },
          }
        },
        async loadStylesheet(id, base) {
          const path = resolve(base, id)
          sources.files.push(path)
          return { path, base: dirname(path), content: readFileSync(path, 'utf8') }
        },
      })
      const output = postcss.parse(compiler.build(candidates), {
        from: root.source?.input.file ?? result.opts.from,
      })
      const initial = {}
      output.walkAtRules('property', (rule) => {
        rule.walkDecls('initial-value', (declaration) => {
          initial[rule.params] = declaration.value
        })
        rule.remove()
      })
      // Tailwind's fallback global property initialization is replaced with a
      // scoped reset below, so importing the library cannot reset host nodes.
      output.walkAtRules('supports', (rule) => {
        if (rule.params.includes('-webkit-hyphens') || rule.params.includes('-moz-orient')) rule.remove()
      })
      output.walkAtRules('layer', (rule) => {
        if (rule.nodes) rule.replaceWith(...rule.nodes)
        else rule.remove()
      })
      output.walkRules((rule) => {
        rule.selector = selectorParser((selectors) => {
          for (const selector of [...selectors.nodes]) {
            let expanded = [selector.clone()]
            selector.walkClasses((node) => {
              const originals = aliases.get(node.value)
              if (!originals) return
              expanded = expanded.flatMap((entry) =>
                [...originals].map((original) => {
                  const copy = entry.clone()
                  copy.walkClasses((part) => {
                    if (part.value === node.value) part.value = original
                  })
                  return copy
                }),
              )
            })
            selector.replaceWith(...expanded)
          }
          selectors.walkClasses((node) => {
            if (node.value.startsWith('buitw:')) node.value = `bui-${node.value.slice(6)}`
          })
          legacyPeerSelectors(selectors)
        }).processSync(rule.selector)
      })
      // Keep the existing transform cascade, including its interaction with
      // animated keyframes, instead of stacking new independent properties.
      Object.assign(initial, {
        '--tw-translate-x': '0',
        '--tw-translate-y': '0',
        '--tw-rotate': '0',
        '--tw-skew-x': '0',
        '--tw-skew-y': '0',
        '--tw-scale-x': '1',
        '--tw-scale-y': '1',
      })
      output.walkDecls((declaration) => {
        if (declaration.prop.startsWith('--tw-translate-'))
          declaration.value = simplifyProduct(declaration.value)
        if (declaration.prop.startsWith('--tw-scale-') && declaration.value.endsWith('%'))
          declaration.value = String(parseFloat(declaration.value) / 100)
        if (declaration.prop === 'translate' || declaration.prop === 'scale')
          declaration.replaceWith({ prop: 'transform', value: legacyTransform })
        else if (declaration.prop === 'rotate')
          declaration.replaceWith(
            { prop: '--tw-rotate', value: declaration.value },
            { prop: 'transform', value: legacyTransform },
          )
      })
      const defaults = postcss.rule({ selector: '.bui-reset, .bui-reset::before, .bui-reset::after' })
      for (const [property, value] of Object.entries(initial)) defaults.append({ prop: property, value })
      if (defaults.nodes?.length) output.prepend(defaults)
      // Flatten nesting for emitted CSS and DOM-based contract tests, while
      // retaining modern color-mix support and the documented browser floor.
      const flattened = transform({
        filename: result.opts.from ?? 'bauhaus.css',
        code: Buffer.from(output.toString()),
        include: Features.Nesting,
      }).code.toString()
      const final = postcss.parse(flattened, { from: root.source?.input.file ?? result.opts.from })
      final.walkRules((rule) => {
        rule.selector = selectorParser((selectors) =>
          selectors.walkPseudos((node) => {
            if (node.value === ':before' || node.value === ':after') node.value = `:${node.value}`
          }),
        ).processSync(rule.selector)
      })
      root.removeAll()
      root.append(final.nodes)
      for (const file of sources.files)
        result.messages.push({ type: 'dependency', plugin: 'bauhaus-tailwind-compat', file })
      for (const glob of sources.globs)
        result.messages.push({
          type: 'dir-dependency',
          plugin: 'bauhaus-tailwind-compat',
          dir: glob.base,
          glob: glob.pattern,
        })
      result.messages.push({
        type: 'dependency',
        plugin: 'bauhaus-tailwind-compat',
        file: resolve(projectRoot, 'tailwind.config.js'),
      })
    },
  }
}
