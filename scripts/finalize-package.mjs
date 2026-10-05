import { copyFileSync } from 'node:fs'
// Identical public shape, distinct declaration module identities for TS5.5 NodeNext.
copyFileSync(new URL('../dist/index.d.ts', import.meta.url), new URL('../dist/index.d.cts', import.meta.url))
