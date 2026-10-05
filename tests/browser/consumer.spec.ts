import { expect, test, type Page } from '@playwright/test'

async function audit(page: Page, dialog = false) {
  await page.evaluate(async () => {
    await Promise.allSettled(
      document
        .getAnimations()
        .filter((animation) => animation.effect?.getComputedTiming().iterations !== Infinity)
        .map((animation) => animation.finished),
    )
  })
  const scope = dialog ? page.getByRole('dialog').last() : page.locator('main').last()
  await scope.getByRole('button', { name: 'Run accessibility scan', exact: true }).last().click()
  const result = scope.getByTestId('axe-results').last()
  await expect(result).toContainText('violations')
  expect(JSON.parse((await result.textContent())!).violations).toEqual([])
}

async function expectNoRecoverableHydrationErrors(page: Page) {
  expect(JSON.parse((await page.locator('#hydration-errors').textContent())!)).toEqual([])
}

for (const major of ['18', '19']) {
  for (const format of ['', 'cjs.html', 'umd.html']) {
    test(`React${major} ${format || 'ESM'} renders and hydrates`, async ({ page }) => {
      const errors: string[] = []
      page.on('pageerror', (error) => errors.push(error.message))
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text())
      })
      await page.goto(`/react${major}/${format}`)
      await expect(page.getByText(`Ready: React ${major}`, { exact: false })).toBeVisible()
      await page.getByRole('button', { name: 'Hydrated button' }).click()
      await expect(page.getByText('Hydration click passed')).toBeVisible()
      await page.getByRole('checkbox', { name: 'Native consent' }).check()
      await expectNoRecoverableHydrationErrors(page)
      expect(errors).toEqual([])
    })
    test(`React${major} ${format || 'ESM'} hydration gate rejects intentional SSR mismatch after clicking`, async ({
      page,
    }) => {
      const mismatch = format ? format.replace('.html', '-mismatch.html') : 'mismatch.html'
      await page.goto(`/react${major}/${mismatch}`)
      await expect(page.getByText(`Ready: React ${major}`, { exact: false })).toBeVisible()
      await expect(page.locator('#hydration-errors')).not.toHaveText('[]')
      const beforeClick = await page.locator('#hydration-errors').textContent()
      await page.getByRole('button', { name: 'Hydrated button', exact: true }).click()
      await expect(page.locator('#hydration-status')).toContainText('Hydration click failed')
      await expect(page.locator('#hydration-errors')).toHaveText(beforeClick!)
      // Exercise the exact success-gate assertion: a client-rendered working
      // button must not convert a recovered hydration mismatch into a pass.
      await expect(expectNoRecoverableHydrationErrors(page)).rejects.toThrow()
    })
  }

  test.describe(`React${major} consumer interactions`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/react${major}/`)
      await expect(page.getByText(`Ready: React ${major}`, { exact: false })).toBeVisible()
    })

    test('native forms, validity, keyboard, reset and RHF', async ({ page }) => {
      await page.getByRole('button', { name: 'Submit native form' }).click()
      await expect(page.getByTestId('native-result')).toHaveText('Not submitted')
      await expect(page.getByLabel('Native name')).toBeFocused()
      await page.getByLabel('Native name').fill('Ada')
      const consent = page.getByRole('checkbox', { name: 'Native consent' })
      await consent.focus()
      await page.keyboard.press('Space')
      await expect(consent).toBeChecked()
      await page.getByRole('radio', { name: 'Pro', exact: true }).check()
      await page.getByRole('button', { name: 'Submit native form' }).click()
      await expect(page.getByTestId('native-result')).toHaveText(
        '{"name":"Ada","consent":"on","toggle":"on","plan":"pro"}',
      )
      await page.getByRole('button', { name: 'Reset native form' }).click()
      await expect(consent).not.toBeChecked()
      await expect(page.getByRole('radio', { name: 'Basic', exact: true })).toBeChecked()
      await expect(page.getByRole('switch', { name: 'Native switch' })).toBeChecked()
      await page.getByLabel('Registered name').fill('Grace')
      await page.getByLabel('Registered consent').check()
      await page.getByRole('switch', { name: 'Controlled switch' }).check()
      await page.getByRole('radio', { name: 'RHF Pro', exact: true }).check()
      await page.getByRole('button', { name: 'Submit RHF form' }).click()
      await expect(page.getByTestId('rhf-result')).toHaveText(
        '{"registered":"Grace","consent":true,"controlled":true,"plan":"pro"}',
      )
      await page.getByRole('button', { name: 'Reset RHF form' }).click()
      await expect(page.getByLabel('Registered name')).toHaveValue('')
      await expect(page.getByRole('switch', { name: 'Controlled switch' })).not.toBeChecked()
      await audit(page)
    })

    test('compiled CSS has host isolation, native focus, checked transforms and reduced motion', async ({
      page,
    }) => {
      expect(await page.locator('body').evaluate((el) => getComputedStyle(el).margin)).toBe('8px')
      // The unowned heading inherits an explicit host font. UA defaults differ
      // across platforms (e.g. -webkit-standard on macOS), so they are no oracle.
      await expect(page.locator('#host-heading')).toHaveCSS('font-family', 'monospace')
      const checkbox = page.getByRole('checkbox', { name: 'Native consent' })
      await checkbox.focus()
      await page.keyboard.press('Space')
      const box = checkbox.locator('..').locator('span[aria-hidden]')
      await expect(box.locator('svg')).toHaveCSS('opacity', '1')
      await expect(box).toHaveCSS('outline-width', '3px')
      const toggle = page.getByRole('switch', { name: 'Native switch' })
      const knob = toggle.locator('..').locator('span[aria-hidden] > span')
      await expect(knob).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 24, 0)')
      await toggle.uncheck()
      await expect(knob).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)')
      await page.emulateMedia({ reducedMotion: 'reduce' })
      expect(
        parseFloat(await knob.evaluate((el) => getComputedStyle(el).transitionDuration)),
      ).toBeLessThanOrEqual(0.00001)
    })

    test('all Switch sizes stay inside their tracks in LTR, genuine RTL and nested LTR', async ({ page }) => {
      const forms = page.getByTestId('form-direction')
      for (const direction of ['ltr', 'rtl']) {
        if (direction === 'rtl')
          await page.getByRole('button', { name: 'Toggle direction', exact: true }).click()
        await expect(forms).toHaveCSS('direction', direction)
        await expect(page.getByTestId('switch-inherited')).toHaveCSS('direction', direction)
        await expect(page.getByTestId('switch-ltr')).toHaveCSS('direction', 'ltr')
        for (const prefix of ['Inherited', 'Nested LTR']) {
          for (const size of ['sm', 'md', 'lg']) {
            for (const state of ['off', 'on']) {
              const input = forms.getByRole('switch', { name: `${prefix} ${size} ${state}`, exact: true })
              const track = input.locator('..').locator(':scope > span[aria-hidden]')
              const knob = track.locator(':scope > span')
              for (const checked of [state === 'on', state !== 'on']) {
                await input.setChecked(checked)
                await expect
                  .poll(async () => {
                    const t = await track.boundingBox()
                    const k = await knob.boundingBox()
                    return (
                      !!t &&
                      !!k &&
                      k.x >= t.x &&
                      k.y >= t.y &&
                      k.x + k.width <= t.x + t.width &&
                      k.y + k.height <= t.y + t.height
                    )
                  })
                  .toBe(true)
              }
            }
          }
        }
      }
    })

    test('retained Tabs and Accordion preserve drafts while hidden controls leave keyboard navigation', async ({
      page,
      browserName,
    }) => {
      // Safari on macOS uses Option+Tab for broad native page navigation with
      // default keyboard preferences. Do not change the user's OS settings.
      // https://support.apple.com/guide/safari/keyboard-shortcuts-and-gestures-cpsh003/mac
      const nextControl = browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab'
      const product = page.getByRole('region', { name: 'Product contracts', exact: true })
      await product.getByRole('textbox', { name: 'Retained tab note' }).fill('A tab draft')
      const secondTab = product.getByRole('tab', { name: 'Second retained tab', exact: true })
      await secondTab.click()
      await expect(product.locator('input[name="retained-tab-note"]')).toHaveCount(1)
      await expect(product.getByRole('textbox', { name: 'Retained tab note' })).toHaveCount(0)
      await page.keyboard.press(nextControl)
      await expect(product.getByRole('tabpanel', { name: 'Second retained tab', exact: true })).toBeFocused()
      await page.keyboard.press(nextControl)
      await expect(product.getByRole('button', { name: 'Second panel action', exact: true })).toBeFocused()
      await product.getByRole('tab', { name: 'First retained tab', exact: true }).click()
      await expect(product.getByRole('textbox', { name: 'Retained tab note' })).toHaveValue('A tab draft')

      await product.getByRole('textbox', { name: 'Retained accordion note' }).fill('An accordion draft')
      await product.getByRole('button', { name: 'Retained details', exact: true }).click()
      await expect(product.locator('input[name="retained-accordion-note"]')).toHaveCount(1)
      await expect(product.getByRole('textbox', { name: 'Retained accordion note' })).toHaveCount(0)
      await page.keyboard.press(nextControl)
      await expect(
        product.getByRole('button', { name: 'After retained accordion', exact: true }),
      ).toBeFocused()
      await product.getByRole('button', { name: 'Retained details', exact: true }).click()
      await expect(product.getByRole('textbox', { name: 'Retained accordion note' })).toHaveValue(
        'An accordion draft',
      )
    })

    test('packed semantic actions and density scopes retain hierarchy, focus and nested comfortable sizes', async ({
      page,
    }) => {
      const product = page.getByRole('region', { name: 'Product contracts', exact: true })
      const primary = product.getByRole('button', { name: 'Semantic save', exact: true })
      await expect(primary).toHaveCSS('background-color', 'rgb(33, 64, 154)')
      await expect(primary).toHaveCSS('color', 'rgb(255, 255, 255)')
      await expect(product.getByRole('button', { name: 'Semantic cancel', exact: true })).toHaveCSS(
        'box-shadow',
        'none',
      )
      await expect(product.getByRole('button', { name: 'Semantic delete', exact: true })).toHaveCSS(
        'background-color',
        'rgb(184, 30, 22)',
      )
      await primary.focus()
      await expect(primary).toHaveCSS('outline-width', '3px')
      for (const [scope, heights] of [
        ['compact', [32, 36, 44]],
        ['comfortable', [36, 44, 56]],
        ['default', [36, 44, 56]],
      ] as const) {
        for (const [index, size] of ['sm', 'md', 'lg'].entries()) {
          for (const control of ['button', 'input', 'select'])
            await expect(product.getByTestId(`${scope}-${control}-${size}`)).toHaveCSS(
              'height',
              `${heights[index]}px`,
            )
        }
      }
      await expect(product.getByTestId('compact-textarea')).toHaveCSS('padding-top', '8px')
      await expect(product.getByTestId('comfortable-textarea')).toHaveCSS('padding-top', '12px')
      await expect(product.getByTestId('compact-textarea')).toHaveCSS('min-height', '96px')
    })

    test('packed Navbar wraps its content at a narrow viewport without horizontal overflow', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 320, height: 700 })
      const navbar = page.getByRole('navigation', { name: 'Product contract navigation', exact: true })
      await navbar.scrollIntoViewIfNeeded()
      const brand = navbar.getByText('Bauhaus Workspace', { exact: true })
      const firstLink = navbar.getByRole('link', { name: 'Workspace overview', exact: true })
      const navbarBounds = await navbar.boundingBox()
      const brandBounds = await brand.boundingBox()
      const linkBounds = await firstLink.boundingBox()
      expect(linkBounds!.y).toBeGreaterThanOrEqual(brandBounds!.y + brandBounds!.height)
      expect(await navbar.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true)
      for (const link of await navbar.getByRole('link').all()) {
        const bounds = await link.boundingBox()
        expect(bounds!.x).toBeGreaterThanOrEqual(navbarBounds!.x)
        expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(navbarBounds!.x + navbarBounds!.width)
      }
    })

    test('a packed Avatar falls back to named initials when its new image fails', async ({ page }) => {
      const product = page.getByRole('region', { name: 'Product contracts', exact: true })
      const image = product.getByRole('img', { name: 'Ada Lovelace', exact: true })
      await expect(image).toHaveJSProperty('complete', true)
      await product.getByRole('button', { name: 'Break avatar image', exact: true }).click()
      await expect(product.getByRole('img', { name: 'Ada Lovelace', exact: true })).toHaveText('AL')
      await expect(product.getByTestId('contract-avatar').locator('img')).toHaveCount(0)
    })

    test('short viewport keeps all five notifications reachable by keyboard', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 900 })
      await page.getByRole('button', { name: 'Open drawer', exact: true }).click()
      const drawer = page.getByRole('dialog', { name: 'Standalone drawer' })
      for (let i = 0; i < 6; i++)
        await drawer.getByRole('button', { name: 'Add notification', exact: true }).click()
      await page.setViewportSize({ width: 390, height: 320 })
      const notifications = drawer.getByRole('status').filter({ hasText: 'Persistent notification' })
      const dismissals = notifications.getByRole('button', { name: 'Dismiss notification' })
      await expect(dismissals).toHaveCount(5)
      const bounds = await notifications.boundingBox()
      expect(bounds!.y).toBeGreaterThanOrEqual(16)
      expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(304)
      expect(await notifications.evaluate((el) => el.scrollHeight > el.clientHeight)).toBe(true)
      for (let i = 0; i < 5; i++) {
        await dismissals.nth(i).focus()
        await expect(dismissals.nth(i)).toBeInViewport()
        const button = await dismissals.nth(i).boundingBox()
        expect(button!.y).toBeGreaterThanOrEqual(bounds!.y)
        expect(button!.y + button!.height).toBeLessThanOrEqual(bounds!.y + bounds!.height)
      }
      await expect(drawer.getByRole('button', { name: 'Close standalone drawer' })).toBeInViewport()
      await page.setViewportSize({ width: 390, height: 900 })
      await audit(page, true)
    })

    test('timed notifications pause during hover and focus', async ({ page }) => {
      await page.getByRole('button', { name: 'Open drawer', exact: true }).click()
      const drawer = page.getByRole('dialog', { name: 'Standalone drawer' })
      await drawer.getByRole('button', { name: 'Add timed notification' }).click()
      const notification = drawer.getByRole('status').filter({ hasText: 'Timed notification' })
      await notification.getByRole('button', { name: 'Dismiss notification' }).hover()
      await page.waitForTimeout(3200)
      await expect(notification).toBeVisible()
      await notification.getByRole('button', { name: 'Dismiss notification' }).focus()
      await drawer.getByRole('button', { name: 'Close standalone drawer' }).hover()
      await page.waitForTimeout(3200)
      await expect(notification).toBeVisible()
      await drawer.getByRole('button', { name: 'Add timed notification' }).focus()
      await expect(notification).toHaveCount(0, { timeout: 3500 })
    })

    test('long modal, nested drawer, themed notifications, tooltip Escape and focus containment', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 390, height: 650 })
      // Keyboard activation establishes the focus that the dialog must restore.
      // Safari intentionally does not focus native buttons on a mouse click.
      const trigger = page.getByRole('button', { name: 'Open long modal', exact: true })
      await trigger.focus()
      await trigger.press('Enter')
      const modal = page.getByRole('dialog', { name: 'Long modal', exact: true })
      await expect(modal).toBeVisible()
      await expect(modal).toHaveCSS('background-color', 'rgb(38, 35, 31)')
      const bounds = await modal.boundingBox()
      expect(bounds!.y).toBeGreaterThanOrEqual(0)
      expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(650)
      expect(await page.locator('#host-button').evaluate((el) => !!el.closest('[inert]'))).toBe(true)
      await expect(modal.getByRole('button', { name: 'Close long modal' })).toBeFocused()
      await modal.getByRole('button', { name: 'Add notification', exact: true }).click()
      await expect(modal.getByRole('status').filter({ hasText: 'Persistent notification' })).toBeVisible()
      await modal.getByRole('button', { name: 'Dismiss notification' }).click()
      await expect(modal.getByText('Persistent notification')).toHaveCount(0)
      await modal.getByRole('button', { name: 'Dialog tooltip trigger' }).focus()
      await expect(page.getByRole('tooltip')).toBeVisible()
      await page.keyboard.press('Escape')
      await expect(page.getByRole('tooltip')).toHaveCount(0)
      await expect(modal).toBeVisible()
      await modal.getByRole('button', { name: 'Open nested drawer' }).click()
      const drawer = page.getByRole('dialog', { name: 'Nested drawer' })
      await expect(drawer).toBeVisible()
      await drawer.getByRole('button', { name: 'Add notification', exact: true }).click()
      await expect(drawer.getByRole('status').filter({ hasText: 'Persistent notification' })).toBeVisible()
      await audit(page, true)
      await page.keyboard.press('Escape')
      await expect(drawer).toHaveCount(0)
      await expect(modal).toBeVisible()
      await modal.getByTestId('dialog-last').focus()
      await expect(modal.getByTestId('dialog-last')).toBeInViewport()
      for (let i = 0; i < 14; i++) {
        await page.keyboard.press('Tab')
        expect(await modal.evaluate((el) => el.contains(document.activeElement))).toBe(true)
      }
      await audit(page, true)
      await page.keyboard.press('Escape')
      await expect(modal).toHaveCount(0)
      await expect(page.getByRole('button', { name: 'Open long modal', exact: true })).toBeFocused()
      expect(await page.locator('#host-button').evaluate((el) => !!el.closest('[inert]'))).toBe(false)
    })
  })
}
