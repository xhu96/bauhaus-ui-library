import { expect, test } from '@playwright/test'

test('hero alternates its artwork, pauses decorative motion and keeps controls focused', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.clock.install({ time: new Date('2026-10-04T12:00:00Z') })
  await page.clock.pauseAt(new Date('2026-10-04T12:00:01Z'))
  await page.goto('/')
  const artwork = page.locator('.landing-hero-art')
  const playback = page.getByRole('button', { name: 'Pause or resume hero animation' })
  const switchArtwork = page.getByRole('button', { name: 'Switch hero artwork' })
  await expect(artwork).toHaveAttribute('data-artwork', 'mascot')
  await expect(playback).toHaveAttribute('aria-pressed', 'false')
  await expect(artwork.locator('.landing-hero-strip > svg')).toHaveCount(14)
  await expect(artwork.locator('.landing-hero-phase[aria-hidden="true"]')).toHaveCount(2)

  await page.clock.runFor(8000)
  await expect(artwork).toHaveAttribute('data-artwork', 'geometry')
  await playback.focus()
  await page.keyboard.press('Enter')
  await expect(playback).toBeFocused()
  await expect(playback).toHaveAttribute('aria-pressed', 'true')
  await expect(artwork.locator('[data-bui-mascot]')).toHaveCSS('animation-play-state', 'paused')
  await page.clock.runFor(16000)
  await expect(artwork).toHaveAttribute('data-artwork', 'geometry')
  await expect(playback).toBeFocused()

  await page.keyboard.press('Enter')
  await page.clock.runFor(8000)
  await expect(artwork).toHaveAttribute('data-artwork', 'mascot')
  await expect(playback).toBeFocused()
  await switchArtwork.focus()
  await page.keyboard.press('Enter')
  await expect(artwork).toHaveAttribute('data-artwork', 'geometry')
  await expect(playback).toHaveAttribute('aria-pressed', 'true')
  await page.clock.runFor(16000)
  await expect(artwork).toHaveAttribute('data-artwork', 'geometry')
  await expect(switchArtwork).toBeFocused()
})

test('reduced motion starts with stable artwork and permits a manual composition change', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.clock.install({ time: new Date('2026-10-04T12:00:00Z') })
  await page.clock.pauseAt(new Date('2026-10-04T12:00:01Z'))
  await page.goto('/')
  const artwork = page.locator('.landing-hero-art')
  const playback = page.getByRole('button', { name: 'Pause or resume hero animation' })
  await expect(playback).toHaveAttribute('aria-pressed', 'true')
  await page.clock.runFor(16000)
  await expect(artwork).toHaveAttribute('data-artwork', 'mascot')
  await page.getByRole('button', { name: 'Switch hero artwork' }).click()
  await expect(artwork).toHaveAttribute('data-artwork', 'geometry')
  await page.clock.runFor(16000)
  await expect(artwork).toHaveAttribute('data-artwork', 'geometry')
  await expect(artwork.locator('[data-bui-mascot]')).toHaveCSS('animation-name', 'none')

  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await playback.click()
  await expect(playback).toHaveAttribute('aria-pressed', 'false')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(playback).toHaveAttribute('aria-pressed', 'true')
  await page.clock.runFor(16000)
  await expect(artwork).toHaveAttribute('data-artwork', 'geometry')
})

test('both hero compositions preserve layout and square tiles at desktop and mobile widths', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const artwork = page.locator('.landing-hero-art')
  const playback = page.getByRole('button', { name: 'Pause or resume hero animation' })
  const switchArtwork = page.getByRole('button', { name: 'Switch hero artwork' })
  for (const width of [1280, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 })
    if ((await artwork.getAttribute('data-artwork')) !== 'mascot') await switchArtwork.click()
    const before = await artwork.boundingBox()
    await switchArtwork.click()
    await expect(artwork).toHaveAttribute('data-artwork', 'geometry')
    const after = await artwork.boundingBox()
    expect(after!.width).toBeCloseTo(before!.width, 1)
    expect(after!.height).toBeCloseTo(before!.height, 1)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
    const tile = await artwork.locator('.hb .tile').first().boundingBox()
    expect(tile!.width).toBeCloseTo(tile!.height, 1)
    for (const control of [playback, switchArtwork]) {
      const bounds = await control.boundingBox()
      expect(bounds!.x).toBeGreaterThanOrEqual(after!.x)
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(after!.x + after!.width)
      // Firefox serializes fractional coordinates just below an exact 44px.
      expect(bounds!.height).toBeGreaterThanOrEqual(43.99)
    }
  }
})
