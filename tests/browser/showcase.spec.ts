import { expect, test, type Page } from '@playwright/test'
import { resolve } from 'node:path'
import type { AxeResults } from 'axe-core'

async function audit(page: Page, selector: string) {
  await page.evaluate(async () => {
    await Promise.allSettled(
      document
        .getAnimations()
        .filter((animation) => animation.effect?.getComputedTiming().iterations !== Infinity)
        .map((animation) => animation.finished),
    )
  })
  await page.addScriptTag({ path: resolve('node_modules/axe-core/axe.min.js') })
  let result:
    { id: string; targets: AxeResults['violations'][number]['nodes'][number]['target'][] }[] | null = null
  await expect
    .poll(async () => {
      result = await page.evaluate(async (scope) => {
        const axe = (
          window as unknown as { axe: { run: (root: string, options: object) => Promise<AxeResults> } }
        ).axe
        try {
          const result = await axe.run(scope, {
            runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
          })
          return result.violations.map(({ id, nodes }) => ({ id, targets: nodes.map((node) => node.target) }))
        } catch (error) {
          // Storybook's own afterEach scan can still be finishing after its play function.
          if (error instanceof Error && error.message.includes('Axe is already running')) return null
          throw error
        }
      }, selector)
      return result !== null
    })
    .toBe(true)
  expect(result).toEqual([])
}

test('settings adapts its layout without clipping at desktop and small mobile widths', async ({ page }) => {
  await page.goto('/examples/settings/')
  await expect(page.getByRole('textbox', { name: 'Workspace name', exact: true })).toBeVisible()
  for (const width of [1280, 390, 320]) {
    await page.setViewportSize({ width, height: 900 })
    await expect(page.locator('.settings-workspace')).toHaveCSS('display', 'grid')
    await expect(page.getByRole('tablist')).toHaveAttribute(
      'aria-orientation',
      width > 760 ? 'vertical' : 'horizontal',
    )
    await page.getByRole('tab', { name: 'Profile', exact: true }).focus()
    await page.keyboard.press(width > 760 ? 'ArrowDown' : 'ArrowRight')
    await expect(page.getByRole('tab', { name: 'Notifications', exact: true })).toBeFocused()
    await page.keyboard.press(width > 760 ? 'ArrowUp' : 'ArrowLeft')
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
    for (const label of ['Workspace name', 'Contact email']) {
      const bounds = await page.getByRole('textbox', { name: label, exact: true }).boundingBox()
      expect(bounds!.x).toBeGreaterThanOrEqual(0)
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width)
    }
  }
  await audit(page, 'main')
})

test('settings saves edits across tabs and confirms discarded changes', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/examples/settings/')
  const name = page.getByRole('textbox', { name: 'Workspace name', exact: true })
  await name.fill('My workspace')
  await page.getByRole('tab', { name: 'Notifications' }).click()
  await page.getByRole('switch', { name: 'Email notifications' }).uncheck()
  await page.getByRole('tab', { name: 'Profile' }).click()
  await expect(name).toHaveValue('My workspace')
  await page.getByRole('button', { name: 'Save changes', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Saving changes' })).toBeDisabled()
  await page.getByRole('tab', { name: 'Team', exact: true }).click()
  await expect(page.getByRole('status', { name: 'Save status' })).toContainText('Changes saved')
  await page.getByRole('tab', { name: 'Profile', exact: true }).click()
  await name.fill('Not saved')
  await page.getByRole('button', { name: 'Discard changes', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: 'Discard unsaved changes?' })
  await expect(dialog).toBeVisible()
  await audit(page, '[role="dialog"]')
  await dialog.getByRole('button', { name: 'Discard changes', exact: true }).click()
  await expect(name).toHaveValue('My workspace')
  await expect(page.getByRole('tab', { name: 'Profile', exact: true })).toBeFocused()
  await page.reload()
  await expect(name).toHaveValue('My workspace')
  expect(errors).toEqual([])
})

test('settings exposes clear member search and supports compact dark controls', async ({ page }) => {
  await page.goto('/examples/settings/')
  const name = page.getByRole('textbox', { name: 'Workspace name', exact: true })
  await expect(name).toBeVisible()
  await expect(name).toHaveCSS('height', '44px')
  await page.getByRole('button', { name: 'Compact layout' }).click()
  await expect(name).toHaveCSS('height', '36px')
  await page.getByRole('button', { name: 'Dark theme' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-bui-theme', 'dark')
  await audit(page, 'main')
  await page.getByRole('tab', { name: 'Team', exact: true }).click()
  await page.getByRole('searchbox', { name: 'Search members' }).fill('nobody')
  await expect(page.getByText('No members match your search.')).toBeVisible()
  await page.getByRole('button', { name: 'Clear search' }).click()
  await expect(page.getByText('Anni Albers', { exact: true })).toBeVisible()
  await expect(page.getByRole('searchbox', { name: 'Search members' })).toBeFocused()
})

test('Navbar keeps its brand and translated links separate at small widths', async ({ page }) => {
  await page.goto('/storybook/iframe.html?id=navigation-navbar--responsive-translations&viewMode=story')
  const nav = page.getByRole('navigation')
  await expect(nav).toBeVisible()
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 900 })
    const brand = await nav.locator(':scope > div').first().boundingBox()
    for (const link of await nav.getByRole('link').all()) {
      const bounds = await link.boundingBox()
      expect(bounds!.y).toBeGreaterThanOrEqual(brand!.y + brand!.height)
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width)
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
  }
})

test('Navbar wraps unbroken workspace and link labels at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 })
  await page.goto('/storybook/iframe.html?id=navigation-navbar--long-unbroken-labels&viewMode=story')
  const nav = page.getByRole('navigation')
  await expect(nav).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320)
  for (const link of await nav.getByRole('link').all()) {
    expect(await link.evaluate((element) => element.scrollWidth)).toBeLessThanOrEqual(
      await link.evaluate((element) => element.clientWidth),
    )
  }
})

test('density supports nested comfortable scopes and all native controls', async ({ page }) => {
  await page.goto('/storybook/iframe.html?id=core-button--compact-density&viewMode=story')
  await expect(page.getByRole('button', { name: 'Small action' })).toHaveCSS('height', '32px')
  await expect(page.getByRole('button', { name: 'Medium action' })).toHaveCSS('height', '36px')
  await expect(page.getByRole('button', { name: 'Large action' })).toHaveCSS('height', '44px')
  await expect(page.getByRole('button', { name: 'Comfortable nested action' })).toHaveCSS('height', '44px')
  await expect(page.locator('input[data-bui-control="input"]')).toHaveCSS('height', '36px')
  await expect(page.locator('select[data-bui-control="select"]')).toHaveCSS('height', '36px')
  await expect(page.locator('textarea[data-bui-control="textarea"]')).toHaveCSS('padding-top', '8px')
})

test('copyable custom-header dialogs have an accessible name', async ({ page }) => {
  await page.goto('/storybook/iframe.html?id=overlay-modal--custom-header&viewMode=story')
  const dialog = page.getByRole('dialog', { name: 'Custom composition' })
  await expect(dialog).toBeVisible()
  await audit(page, '[role="dialog"]')
})

test('Settings recovery story executes its error and retry interaction', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/storybook/iframe.html?id=examples-settings--save-recovery&viewMode=story')
  await expect(page.getByRole('status', { name: 'Save status' })).toContainText('Changes saved')
  await expect(page.getByRole('textbox', { name: 'Workspace name', exact: true })).toHaveValue(
    'Bauhaus Studio edited',
  )
  await expect(page.getByRole('button', { name: 'Save changes', exact: true })).toBeDisabled()
  await audit(page, '.settings-example')
  expect(errors).toEqual([])
})
