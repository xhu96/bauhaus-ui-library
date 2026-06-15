import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  // Relative base in production so Storybook works under the Pages /storybook/ subpath.
  async viteFinal(config, { configType }) {
    if (configType === 'PRODUCTION') config.base = './'
    return config
  },
}

export default config
