import { composeStories } from '@storybook/react'
import { describe, expect, it, vi } from 'vitest'
import * as checkboxStories from '../components/Checkbox.stories'
import preview from '../../.storybook/preview'

describe('semantic color controls', () => {
  it('composes Checkbox stories without treating BauhausColor as a CSS color', () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      const stories = composeStories(
        {
          ...checkboxStories,
          default: {
            ...checkboxStories.default,
            argTypes: {
              ...checkboxStories.default.argTypes,
              color: {
                ...checkboxStories.default.argTypes.color,
                // react-docgen reports this referenced union as "other" in built docs.
                type: { name: 'other', value: 'BauhausColor' },
              },
            },
          },
        },
        preview,
      )
      expect(stories.Default.argTypes.color?.control).toMatchObject({ type: 'select' })
      expect(warning.mock.calls.flat().join(' ')).not.toContain('Control of type color')
    } finally {
      warning.mockRestore()
    }
  })
})
