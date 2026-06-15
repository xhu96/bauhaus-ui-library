import type { Preview } from '@storybook/react'
import '../src/styles/globals.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    backgrounds: {
      default: 'paper',
      values: [
        { name: 'paper', value: '#F3EFE6' },
        { name: 'white', value: '#FFFFFF' },
        { name: 'ink', value: '#1C1C1C' },
      ],
    },
    options: {
      storySort: {
        order: ['Foundations', 'Core', 'Form', 'Display', 'Navigation', 'Overlay'],
      },
    },
  },
}

export default preview
