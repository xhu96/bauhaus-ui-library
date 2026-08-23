import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const projectRoot = resolve(import.meta.dirname, '..')
const temporaryRoot = mkdtempSync(join(tmpdir(), 'bauhaus-ui-smoke-'))
const packageDirectory = join(temporaryRoot, 'package')
const fixtureDirectory = join(temporaryRoot, 'consumer')

function run(command, args, cwd = projectRoot) {
  execFileSync(command, args, { cwd, stdio: 'inherit' })
}

try {
  mkdirSync(packageDirectory)
  mkdirSync(fixtureDirectory)

  const packOutput = execFileSync(
    'npm',
    ['pack', '--json', '--ignore-scripts', '--pack-destination', packageDirectory],
    { cwd: projectRoot, encoding: 'utf8' },
  )
  const [{ filename, files }] = JSON.parse(packOutput)
  const tarball = join(packageDirectory, filename)

  assert(
    files.some(({ path }) => path === 'dist/bauhaus-ui.js'),
    'ESM bundle is missing from the tarball',
  )
  assert(
    files.some(({ path }) => path === 'dist/bauhaus-ui.cjs'),
    'CJS bundle is missing from the tarball',
  )
  assert(
    files.some(({ path }) => path === 'dist/bauhaus-ui.umd.cjs'),
    'UMD browser bundle is missing from the tarball',
  )
  assert(
    files.some(({ path }) => path === 'dist/index.d.ts'),
    'Type declarations are missing from the tarball',
  )
  assert(
    files.some(({ path }) => path === 'dist/style.css'),
    'Distributed CSS is missing from the tarball',
  )

  writeFileSync(
    join(fixtureDirectory, 'package.json'),
    JSON.stringify({ name: 'bauhaus-ui-consumer-smoke', private: true, type: 'module' }, null, 2),
  )

  run(
    'npm',
    [
      'install',
      '--ignore-scripts',
      '--no-audit',
      '--no-fund',
      '--save-exact',
      tarball,
      'react@18.3.1',
      'react-dom@18.3.1',
      'typescript@5.9.3',
      '@types/react@18.3.3',
      '@types/react-dom@18.3.0',
    ],
    fixtureDirectory,
  )

  writeFileSync(
    join(fixtureDirectory, 'esm-smoke.mjs'),
    `import React from 'react'
import { renderToString } from 'react-dom/server'
import { BauhausMascot, Button, Modal } from 'bauhaus-ui-library'

const button = renderToString(React.createElement(Button, null, 'Smoke'))
const mascot = renderToString(
  React.createElement(BauhausMascot, { pose: 'running', label: 'Bauhaus dog' }),
)
const modal = renderToString(
  React.createElement(Modal, { open: true, title: 'Smoke modal', onClose() {} }, 'Body'),
)

if (!button.includes('Smoke')) throw new Error('ESM Button render failed')
if (!mascot.includes('data-bui-mascot="running"')) throw new Error('ESM BauhausMascot render failed')
if (modal !== '') throw new Error('An initially-open Modal must remain SSR-safe')
if (!import.meta.resolve('bauhaus-ui-library/styles.css').endsWith('/dist/style.css')) {
  throw new Error('CSS export resolution failed')
}
`,
  )

  writeFileSync(
    join(fixtureDirectory, 'cjs-smoke.cjs'),
    `const library = require('bauhaus-ui-library')
if (typeof library.Button !== 'object' && typeof library.Button !== 'function') {
  throw new Error('CJS Button export is missing')
}
if (!require.resolve('bauhaus-ui-library/styles.css').endsWith('/dist/style.css')) {
  throw new Error('CJS CSS export resolution failed')
}
`,
  )

  writeFileSync(
    join(fixtureDirectory, 'umd-smoke.mjs'),
    `import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { runInNewContext } from 'node:vm'
import React from 'react'
import * as ReactDOM from 'react-dom'

const umdPath = fileURLToPath(import.meta.resolve('bauhaus-ui-library/umd'))
const umdSource = readFileSync(umdPath, 'utf8')
const browserGlobals = { React, ReactDOM }

runInNewContext(umdSource, browserGlobals)

if (typeof browserGlobals.BauhausUI?.Button !== 'object' &&
    typeof browserGlobals.BauhausUI?.Button !== 'function') {
  throw new Error('UMD browser-global Button export is missing')
}
if (typeof browserGlobals.BauhausUI?.BauhausMascot !== 'function') {
  throw new Error('UMD browser-global BauhausMascot export is missing')
}
if (/jsxRuntime/.test(umdSource)) {
  throw new Error('UMD bundle must not require a separate jsxRuntime browser global')
}
`,
  )

  writeFileSync(
    join(fixtureDirectory, 'consumer.tsx'),
    `import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Button } from 'bauhaus-ui-library'

export function Consumer() {
  return (
    <Accordion type="single" value="one" onValueChange={(value) => value.toUpperCase()}>
      <AccordionItem value="one">
        <AccordionTrigger>One</AccordionTrigger>
        <AccordionContent><Button>Typed consumer</Button></AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
`,
  )

  writeFileSync(
    join(fixtureDirectory, 'tsconfig.json'),
    JSON.stringify(
      {
        compilerOptions: {
          strict: true,
          noEmit: true,
          jsx: 'react-jsx',
          module: 'NodeNext',
          moduleResolution: 'NodeNext',
          target: 'ES2022',
        },
        include: ['consumer.tsx'],
      },
      null,
      2,
    ),
  )

  run('node', ['esm-smoke.mjs'], fixtureDirectory)
  run('node', ['cjs-smoke.cjs'], fixtureDirectory)
  run('node', ['umd-smoke.mjs'], fixtureDirectory)
  run(resolve(fixtureDirectory, 'node_modules/.bin/tsc'), ['--project', 'tsconfig.json'], fixtureDirectory)

  const css = readFileSync(
    resolve(fixtureDirectory, 'node_modules/bauhaus-ui-library/dist/style.css'),
    'utf8',
  )
  assert.match(css, /\.bui-flex\{/)
  assert.doesNotMatch(css, /(^|})\.flex(?=[,{])/)
  assert.doesNotMatch(css, /(^|})\.container(?=[,{])/)

  console.log('Package smoke test passed: ESM, CJS, UMD, SSR, CSS, exports, and declarations.')
} finally {
  rmSync(temporaryRoot, { recursive: true, force: true })
}
