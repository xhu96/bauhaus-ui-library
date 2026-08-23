import { describe, expect, it } from 'vitest'
import { cn } from './utils'

describe('cn', () => {
  it('merges conflicting prefixed Bauhaus utility classes', () => {
    expect(cn('bui-h-9', 'bui-h-11')).toBe('bui-h-11')
    expect(cn('hover:bui-bg-bblue', 'hover:bui-bg-ink')).toBe('hover:bui-bg-ink')
  })
})
