import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { componentCatalog } from './catalog'

describe('built documentation discovery', () => {
  // Source-only unit runs may omit docs. CI must run test:catalog after Storybook;
  // that required gate reads the index unconditionally and fails if it is absent.
  it.skipIf(process.env.BUI_REQUIRE_CATALOG !== '1' && !existsSync('storybook-static/index.json'))(
    'covers every built component family with a real docs ID',
    () => {
      const { entries } = JSON.parse(readFileSync('storybook-static/index.json', 'utf8')) as {
        entries: Record<string, { id: string; title: string; type: string }>
      }
      const componentDocs = Object.values(entries).filter(
        (entry) =>
          entry.type === 'docs' &&
          /^(Foundations|Core|Form|Display|Navigation|Overlay)\//.test(entry.title) &&
          entry.id !== 'foundations-design-tokens--docs',
      )
      expect(componentCatalog.map(([, id]) => `${id}--docs`).sort()).toEqual(
        componentDocs.map(({ id }) => id).sort(),
      )
      for (const [name, id] of componentCatalog) {
        expect(entries[`${id}--docs`]?.title.split('/').pop()).toBe(name)
      }
      expect(entries['examples-onboarding--docs']).toBeDefined()
      expect(entries['examples-onboarding--installation']).toBeDefined()
      expect(entries['examples-onboarding--native-form']).toBeDefined()
      expect(entries['examples-settings--docs']).toBeDefined()
      expect(entries['examples-settings--default']).toBeDefined()
      expect(entries['examples-settings--save-recovery']).toBeDefined()
    },
  )
})
