/// <reference types="vitest/jsdom" />
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Node 26 exposes its own localStorage accessor. Vitest leaves existing globals
// in place, so use this test environment's real jsdom Storage for browser tests.
// Run once per environment; individual tests can still replace/block storage.
for (const key of ['localStorage', 'sessionStorage'] as const) {
  Object.defineProperty(globalThis, key, {
    configurable: true,
    enumerable: true,
    get: () => jsdom.window[key],
  })
}

afterEach(() => {
  cleanup()
  document.body.innerHTML = '<div id="root"></div>'
})
