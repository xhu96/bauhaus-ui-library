import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { cpSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const retain = args.includes('--retain') || args.includes('--serve')
const temporaryRoot = mkdtempSync(join(tmpdir(), 'bauhaus-ui-smoke-'))
const versions = (process.env.REACT_MAJORS || '18,19').split(',')
function run(command, argv, cwd = root) {
  execFileSync(command, argv, {
    cwd,
    stdio: 'inherit',
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' },
  })
}
function json(path, value) {
  writeFileSync(path, JSON.stringify(value, null, 2))
}

try {
  const packageDirectory = join(temporaryRoot, 'package')
  mkdirSync(packageDirectory)
  const [{ filename, files }] = JSON.parse(
    execFileSync('npm', ['pack', '--json', '--ignore-scripts', '--pack-destination', packageDirectory], {
      cwd: root,
      encoding: 'utf8',
    }),
  )
  const tarball = join(packageDirectory, filename)
  const allowed = new Set([
    'dist/bauhaus-ui.js',
    'dist/bauhaus-ui.cjs',
    'dist/bauhaus-ui.umd.cjs',
    'dist/index.d.ts',
    'dist/index.d.cts',
    'dist/style.css',
  ])
  for (const path of allowed)
    if (!path.endsWith('.d.cts'))
      assert(
        files.some((file) => file.path === path),
        `Missing ${path}`,
      )
  for (const { path } of files)
    assert(!path.startsWith('dist/') || allowed.has(path), `Unexpected package artifact ${path}`)
  assert(
    !files.some(({ path }) => /dist-site|storybook-static|src\/|tests\//.test(path)),
    'Site/source leakage',
  )

  for (const major of versions) {
    assert(['18', '19'].includes(major))
    const fixture = join(temporaryRoot, `react${major}`)
    mkdirSync(fixture)
    cpSync(join(root, 'tests/consumer'), fixture, { recursive: true })
    json(join(fixture, 'package.json'), {
      name: `packed-consumer-react${major}`,
      private: true,
      type: 'module',
    })
    const react = major === '18' ? '18.3.1' : '19.2.4'
    run(
      'npm',
      [
        'install',
        '--ignore-scripts',
        '--no-audit',
        '--no-fund',
        '--save-exact',
        tarball,
        `react@${react}`,
        `react-dom@${react}`,
        `@types/react@${major}`,
        `@types/react-dom@${major}`,
        'ts55@npm:typescript@5.5.3',
        'ts59@npm:typescript@5.9.3',
        'esbuild@0.25.12',
        'react-hook-form@7.88.0',
        'axe-core@4.13.0',
      ],
      fixture,
    )
    if (!args.includes('--next-only') && !args.includes('--types-only'))
      run(process.execPath, ['runtime.mjs'], fixture)
    json(join(fixture, 'tsconfig.json'), {
      compilerOptions: {
        strict: true,
        noEmit: true,
        jsx: 'react-jsx',
        module: 'NodeNext',
        moduleResolution: 'NodeNext',
        target: 'ES2022',
      },
      include: ['consumer.tsx', 'consumer.cts'],
    })
    if (!args.includes('--next-only')) {
      for (const compiler of ['ts55', 'ts59'])
        run(process.execPath, [`node_modules/${compiler}/bin/tsc`, '-p', 'tsconfig.json'], fixture)
      assert(
        files.some((file) => file.path === 'dist/index.d.cts'),
        'Missing CJS declarations',
      )
    }
    const css = readFileSync(join(fixture, 'node_modules/bauhaus-ui-library/dist/style.css'), 'utf8')
    assert.match(css, /\.bui-flex\{/)
    assert.doesNotMatch(css, /(^|})\.(flex|container)(?=[,{])/)
    if (!args.includes('--runtime-only') && !args.includes('--next-only') && !args.includes('--types-only'))
      run(process.execPath, ['build-browser.mjs'], fixture)
    if (major === '19' && !args.includes('--skip-next') && !args.includes('--runtime-only')) {
      run(
        'npm',
        ['install', '--ignore-scripts', '--no-audit', '--no-fund', '--save-exact', 'next@16.3.5'],
        fixture,
      )
      run(
        process.execPath,
        ['../node_modules/next/dist/bin/next', 'build', '--webpack'],
        join(fixture, 'next'),
      )
      assert.match(readFileSync(join(fixture, 'next/out/index.html'), 'utf8'), /Direct client entry/)
    }
  }
  console.log(`PASS: packed React ${versions.join('/')} ESM/CJS/UMD, SSR, TS5.5/5.9, CSS`)
  if (retain) console.log(`RETAINED_FIXTURES=${temporaryRoot}`)
  if (args.includes('--serve'))
    run(process.execPath, [join(root, 'scripts/serve-consumers.mjs'), temporaryRoot])
} finally {
  if (!retain) rmSync(temporaryRoot, { recursive: true, force: true })
  else console.log(`Retained for inspection: ${temporaryRoot}`)
}
