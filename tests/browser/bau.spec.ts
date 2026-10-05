import { expect, test } from '@playwright/test'

test('Bau shows six expressions and keeps the pose example synchronized with pointer and keyboard selection', async ({
  page,
}) => {
  await page.goto('/bau/')
  const expressions = page.locator('.bau-expression-rail')
  await expect(expressions.getByRole('img')).toHaveCount(6)
  for (const expression of ['Curious', 'Focused', 'Happy', 'Playful', 'Proud', 'Calm']) {
    await expect(expressions.getByRole('img', { name: `Bau — ${expression}`, exact: true })).toBeVisible()
  }

  const gallery = page.getByRole('region', { name: 'Pose gallery' })
  const running = gallery.getByRole('button', { name: /^Running/ })
  const standing = gallery.getByRole('button', { name: /^Standing/ })
  const working = gallery.getByRole('button', { name: /^Working/ })
  for (const pose of [standing, working]) {
    await expect(pose.locator('[data-part="smile"]')).toBeVisible()
    await expect(pose.locator('[data-part="closed-mouth"]')).toHaveCount(0)
  }
  await expect(running.locator('[data-part="closed-mouth"]')).toBeVisible()
  await expect(running.locator('[data-part="smile"]')).toHaveCount(0)

  const api = page.getByRole('region', { name: 'Component API' })
  await running.click()
  await expect(running).toHaveAttribute('aria-pressed', 'true')
  await expect(standing).toHaveAttribute('aria-pressed', 'false')
  await expect(api.locator('code')).toHaveText('<BauhausMascot pose="running" expression="focused" />')
  await expect(api.getByRole('button', { name: 'Running', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  )

  const keyboardWorking = api.getByRole('button', { name: 'Working', exact: true })
  await keyboardWorking.focus()
  await page.keyboard.press('Space')
  await expect(keyboardWorking).toBeFocused()
  await expect(working).toHaveAttribute('aria-pressed', 'true')
  await expect(running).toHaveAttribute('aria-pressed', 'false')
  await expect(api.locator('code')).toHaveText('<BauhausMascot pose="working" expression="happy" />')

  await standing.focus()
  await page.keyboard.press('Enter')
  await expect(standing).toBeFocused()
  await expect(standing).toHaveAttribute('aria-pressed', 'true')
  await expect(api.locator('code')).toHaveText('<BauhausMascot pose="standing" expression="happy" />')
})

test('Bau keeps its expression and pose panels visible without overflow in both themes and responsive layouts', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const theme of ['Light', 'Dark']) {
    await page.goto('/')
    await page.getByRole('button', { name: theme, exact: true }).click()
    await page.goto('/bau/')
    await expect(page.locator('html')).toHaveAttribute('data-bui-theme', theme.toLowerCase())

    for (const width of [320, 390, 901, 1280]) {
      await page.setViewportSize({ width, height: 900 })
      await expect(page.locator('.bau-expression-rail svg')).toHaveCount(6)
      await expect(page.locator('.bau-pose-grid svg')).toHaveCount(3)
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)

      for (const artwork of await page.locator('.bau-expression-rail svg, .bau-pose-grid svg').all()) {
        await expect(artwork).toBeVisible()
        const bounds = await artwork.evaluate((svg) => {
          const panel = svg.closest('figure, button')!.getBoundingClientRect()
          const image = svg.getBoundingClientRect()
          const art = svg.closest('.bau-pose-art')
          // Pose scenes deliberately overscan their SVG viewport, then clip to
          // the art panel. Verify the visible result rather than its hidden bleed.
          const clip = art ? art.getBoundingClientRect() : panel
          return {
            panel: { left: panel.left, right: panel.right, top: panel.top, bottom: panel.bottom },
            visible: {
              left: Math.max(image.left, clip.left),
              right: Math.min(image.right, clip.right),
              top: Math.max(image.top, clip.top),
              bottom: Math.min(image.bottom, clip.bottom),
            },
            clipped: art ? getComputedStyle(art).overflow : null,
          }
        })
        if (bounds.clipped) expect(bounds.clipped).toBe('hidden')
        expect(bounds.visible.right).toBeGreaterThan(bounds.visible.left)
        expect(bounds.visible.bottom).toBeGreaterThan(bounds.visible.top)
        expect(bounds.visible.left).toBeGreaterThanOrEqual(bounds.panel.left - 0.5)
        expect(bounds.visible.right).toBeLessThanOrEqual(bounds.panel.right + 0.5)
        expect(bounds.visible.top).toBeGreaterThanOrEqual(bounds.panel.top - 0.5)
        expect(bounds.visible.bottom).toBeLessThanOrEqual(bounds.panel.bottom + 0.5)
        expect(bounds.visible.left).toBeGreaterThanOrEqual(-0.5)
        expect(bounds.visible.right).toBeLessThanOrEqual(width + 0.5)
      }
    }

    const contrast = await page.locator('.bau-page').evaluate((element) => {
      const style = getComputedStyle(element)
      const luminance = (color: string) => {
        const channels = color
          .match(/[\d.]+/g)!
          .slice(0, 3)
          .map(Number)
          .map((channel) => {
            const value = channel / 255
            return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
          })
        return channels.reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0)
      }
      const [lighter, darker] = [luminance(style.color), luminance(style.backgroundColor)].sort(
        (a, b) => b - a,
      )
      return (lighter + 0.05) / (darker + 0.05)
    })
    expect(contrast).toBeGreaterThanOrEqual(4.5)
  }
})
