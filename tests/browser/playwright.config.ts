import { defineConfig, devices } from '@playwright/test'
import { resolve } from 'node:path'

export default defineConfig({
  testDir: '.',
  testMatch: 'consumer.spec.ts',
  fullyParallel: true,
  workers: 3,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never', outputFolder: resolve('playwright-report/consumer') }]],
  outputDir: resolve('test-results/consumer'),
  use: { baseURL: 'http://127.0.0.1:4192', trace: 'retain-on-failure' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: `node scripts/serve-consumers.mjs "${process.env.CONSUMER_FIXTURES}"`,
    cwd: resolve('.'),
    url: 'http://127.0.0.1:4192/react18/',
    reuseExistingServer: !process.env.CI,
  },
})
