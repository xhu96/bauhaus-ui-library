import React, { useEffect } from 'react'
import type { Preview, Decorator } from '@storybook/react'
import '../src/styles/globals.css'

// Applies the library's `.dark` class to both the story container (in-canvas
// components) and <html> (portalled Modal/Drawer/Toast), driven by the toolbar.
const ThemeWrapper: React.FC<{ theme: string; children: React.ReactNode }> = ({ theme, children }) => {
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    return () => root.classList.remove('dark')
  }, [theme])
  return (
    <div
      className={theme === 'dark' ? 'dark' : ''}
      style={{
        background: theme === 'dark' ? '#161412' : '#F3EFE6',
        minHeight: '100vh',
        padding: '2rem',
      }}
    >
      {children}
    </div>
  )
}

const withTheme: Decorator = (Story, context) => (
  <ThemeWrapper theme={(context.globals.theme as string) || 'light'}>
    <Story />
  </ThemeWrapper>
)

export const globalTypes = {
  theme: {
    description: 'Bauhaus light / dark theme',
    toolbar: {
      title: 'Theme',
      icon: 'sun',
      items: [
        { value: 'light', title: 'Light', icon: 'sun' },
        { value: 'dark', title: 'Dark', icon: 'moon' },
      ],
      dynamicTitle: true,
    },
  },
}

export const initialGlobals = { theme: 'light' }

const preview: Preview = {
  decorators: [withTheme],
  parameters: {
    layout: 'fullscreen',
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    options: {
      storySort: {
        order: ['Introduction', 'Foundations', 'Core', 'Form', 'Display', 'Navigation', 'Overlay'],
      },
    },
  },
}

export default preview
