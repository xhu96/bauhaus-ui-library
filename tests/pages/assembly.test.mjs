import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, existsSync, symlinkSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'

const script = new URL('../../scripts/assemble-pages.mjs', import.meta.url)
test('one assembly retains both frozen sites, immutable provenance and previous valid output', () => {
  const root = mkdtempSync(join(tmpdir(), 'bauhaus-pages-test-'))
  try {
    for (const folder of ['old/dist', 'old/storybook-static', 'dev/dist-site', 'dev/storybook-static']) {
      mkdirSync(join(root, folder), { recursive: true })
      writeFileSync(join(root, folder, 'index.html'), `<html>${folder}</html>`)
    }
    const args = [
      script.pathname,
      '--legacy',
      join(root, 'old'),
      '--dev',
      join(root, 'dev'),
      '--sha',
      'a'.repeat(40),
      '--output',
      join(root, 'pages'),
      '--dirty',
    ]
    execFileSync(process.execPath, args)
    assert.match(readFileSync(join(root, 'pages/index.html'), 'utf8'), /old\/dist/)
    assert.match(readFileSync(join(root, 'pages/storybook/index.html'), 'utf8'), /old\/storybook/)
    assert.match(readFileSync(join(root, 'pages/0.2.0dev/index.html'), 'utf8'), /dev\/dist-site/)
    assert.match(readFileSync(join(root, 'pages/0.2.0dev/storybook/index.html'), 'utf8'), /dev\/storybook/)
    const manifest = JSON.parse(readFileSync(join(root, 'pages/provenance.json'), 'utf8'))
    assert.equal(manifest.legacy.sha, '073de432fc4a66a4425d018eed95776e75a5cc7e')
    assert.equal(manifest.dev.label, '0.2.0dev2')
    assert.equal(manifest.dev.sha, 'a'.repeat(40))
    assert.equal(manifest.dev.dirty, true)
    assert.equal(manifest.files.length, 4)
    assert.equal(
      manifest.files.find((file) => file.path === 'index.html').sha256,
      createHash('sha256').update('<html>old/dist</html>').digest('hex'),
    )
    const output = execFileSync(process.execPath, args, { encoding: 'utf8' })
    assert.match(output, /Previous valid assembly retained/)
    assert.throws(
      () =>
        execFileSync(
          process.execPath,
          args.map((value, index) => (index === 6 ? 'main' : value)),
          { stdio: 'pipe' },
        ),
      /immutable commit SHA/,
    )
    symlinkSync(join(root, 'old/dist/index.html'), join(root, 'dev/dist-site/escape.html'))
    assert.throws(() => execFileSync(process.execPath, args, { stdio: 'pipe' }), /Symlinks are not allowed/)
    rmSync(join(root, 'dev/dist-site/escape.html'))
    rmSync(join(root, 'dev/dist-site/index.html'))
    assert.throws(() => execFileSync(process.execPath, args, { stdio: 'pipe' }))
    assert(
      existsSync(join(root, 'pages/0.2.0dev/index.html')),
      'Invalid new inputs must preserve last valid output',
    )
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})
