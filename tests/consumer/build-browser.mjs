import { build } from 'esbuild'
import { mkdirSync, writeFileSync, copyFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import React from 'react'
import { renderToString } from 'react-dom/server'
import * as library from 'bauhaus-ui-library'

const require = createRequire(import.meta.url)
mkdirSync('browser', { recursive: true })
copyFileSync(require.resolve('bauhaus-ui-library/styles.css'), 'browser/styles.css')
copyFileSync(require.resolve('bauhaus-ui-library/umd'), 'browser/library.umd.js')
for (const format of ['esm', 'cjs', 'umd']) {
  const plugins =
    format === 'esm'
      ? []
      : [
          {
            name: 'packed-format',
            setup(builder) {
              builder.onResolve({ filter: /^bauhaus-ui-library$/ }, () =>
                format === 'cjs'
                  ? { path: require.resolve('bauhaus-ui-library') }
                  : { path: 'umd-global', namespace: 'global' },
              )
              builder.onLoad({ filter: /.*/, namespace: 'global' }, () => ({
                contents: `export const { ${Object.keys(library).join(', ')} } = globalThis.BauhausUI`,
                loader: 'js',
              }))
            },
          },
        ]
  const common = {
    bundle: true,
    format: 'esm',
    jsx: 'automatic',
    plugins,
    define: { 'process.env.NODE_ENV': '"production"' },
    minify: true,
  }
  if (format === 'umd') {
    // Splitting keeps one installed React instance shared by the global bridge
    // and the app, including its renderer and hooks.
    await build({
      ...common,
      stdin: {
        contents: `import React from 'react'; import * as ReactDOM from 'react-dom'; globalThis.React=React; globalThis.ReactDOM=ReactDOM; const s=document.createElement('script'); s.src='./library.umd.js'; s.onload=()=>import('./browser-app.jsx'); document.head.append(s);`,
        resolveDir: process.cwd(),
      },
      splitting: true,
      outdir: 'browser/umd-entry',
      entryNames: 'bootstrap',
    })
  } else await build({ ...common, entryPoints: ['browser-app.jsx'], outfile: `browser/${format}.js` })
  const bootstrap = `<script type="module" src="./${format === 'umd' ? 'umd-entry/bootstrap' : format}.js"></script>`
  for (const mismatch of [false, true]) {
    const name = mismatch
      ? format === 'esm'
        ? 'mismatch'
        : `${format}-mismatch`
      : format === 'esm'
        ? 'index'
        : format
    const serverText = mismatch ? 'Deliberately mismatched server text' : 'Hydrated button'
    writeFileSync(
      `browser/${name}.html`,
      `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Packed React ${React.version} ${format} consumer${mismatch ? ' — intentional hydration mismatch' : ''}</title><link rel="stylesheet" href="./styles.css"></head><body><div id="hydrated">${renderToString(React.createElement(library.Button, null, serverText))}</div><p id="hydration-status" role="status">SSR content ready</p><p>Recoverable hydration errors: <output id="hydration-errors" aria-label="Recoverable hydration errors">[]</output></p><div id="app"></div>${bootstrap}</body></html>`,
    )
  }
}
console.log(
  'Standalone packed browser fixtures built: index.html, cjs.html, umd.html and intentional mismatch variants',
)
