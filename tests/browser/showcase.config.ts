import { defineConfig, devices } from '@playwright/test'
import { resolve } from 'node:path'

const externalUrl = process.env.BUI_SHOWCASE_URL
export default defineConfig({
  testDir: '.',
  testMatch: ['showcase.spec.ts', 'hero.spec.ts', 'bau.spec.ts'],
  fullyParallel: true,
  workers: 3,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never', outputFolder: resolve('playwright-report/showcase') }]],
  outputDir: resolve('test-results/showcase'),
  use: { baseURL: externalUrl ?? 'http://127.0.0.1:4191', trace: 'retain-on-failure' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: externalUrl
    ? undefined
    : {
        command: 'node scripts/serve-showcase.mjs',
        cwd: resolve('.'),
        url: 'http://127.0.0.1:4191/examples/settings/',
        reuseExistingServer: !process.env.CI,
      },
})
