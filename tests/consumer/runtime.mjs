import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import React from 'react'
import * as ReactDOM from 'react-dom'
import { renderToString } from 'react-dom/server'
import * as esm from 'bauhaus-ui-library'

const require = createRequire(import.meta.url)
const source = readFileSync(require.resolve('bauhaus-ui-library/umd'), 'utf8')
const globals = { React, ReactDOM }
runInNewContext(source, globals)
for (const [format, lib] of Object.entries({
  esm,
  cjs: require('bauhaus-ui-library'),
  umd: globals.BauhausUI,
})) {
  assert.match(
    renderToString(React.createElement(lib.Button, null, `${format} render`)),
    new RegExp(`${format} render`),
  )
  assert.match(
    renderToString(React.createElement(lib.BauhausMascot, { pose: 'running' })),
    /data-bui-mascot="running"/,
  )
  assert.equal(renderToString(React.createElement(lib.Modal, { open: true, title: 'SSR', onClose() {} })), '')
  assert.match(
    renderToString(React.createElement(lib.Checkbox, { label: 'SSR check', defaultChecked: true })),
    /checked/,
  )
}
assert.doesNotMatch(source, /ReactCurrentOwner|SECRET_INTERNALS|jsxRuntime/)
for (const file of ['bauhaus-ui.js', 'bauhaus-ui.cjs']) {
  assert.match(
    readFileSync(new URL(`./node_modules/bauhaus-ui-library/dist/${file}`, import.meta.url), 'utf8'),
    /^['"]use client['"]/,
  )
}
assert.match(require.resolve('bauhaus-ui-library/styles.css'), /dist\/style.css$/)
console.log(`React ${React.version}: ESM/CJS/UMD actual rendering and SSR passed`)
