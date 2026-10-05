import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'

const argv = process.argv.slice(2)
const option = (name) => argv[argv.indexOf(name) + 1]
for (const name of ['--legacy', '--dev', '--sha', '--output'])
  assert(argv.includes(name) && option(name), `Required ${name}`)
const legacy = resolve(option('--legacy'))
const dev = resolve(option('--dev'))
const output = resolve(option('--output'))
const sha = option('--sha')
assert(/^[a-f0-9]{40}$/.test(sha), 'Development provenance must be a full immutable commit SHA')
const inputs = [
  join(legacy, 'dist'),
  join(legacy, 'storybook-static'),
  join(dev, 'dist-site'),
  join(dev, 'storybook-static'),
]
for (const input of inputs) {
  assert(
    lstatSync(input).isDirectory() && !lstatSync(input).isSymbolicLink(),
    'Inputs must be real directories',
  )
  assert(existsSync(join(input, 'index.html')), `Missing built entry: ${input}/index.html`)
  assert(
    output !== input && !output.startsWith(input + sep) && !input.startsWith(output + sep),
    'Output cannot contain or overlap inputs',
  )
}
assert(output !== dev && output !== legacy && output !== dirname(output), 'Unsafe output directory')
const digest = (bytes) => createHash('sha256').update(bytes).digest('hex')
function inventory(root, folder = root) {
  return readdirSync(folder)
    .sort()
    .flatMap((name) => {
      const path = join(folder, name)
      const stat = lstatSync(path)
      assert(!stat.isSymbolicLink(), `Symlinks are not allowed in Pages inputs: ${path}`)
      if (stat.isDirectory()) return inventory(root, path)
      assert(stat.isFile(), `Unsupported Pages input: ${path}`)
      return [{ path: relative(root, path).split(sep).join('/'), sha256: digest(readFileSync(path)) }]
    })
}
// Validate every input before touching a previous valid assembly.
inputs.forEach((input) => inventory(input))
mkdirSync(dirname(output), { recursive: true })
const staging = mkdtempSync(join(dirname(output), '.pages-staging-'))
let previous
try {
  // Keep the historical preview URLs independent of the branch/package name.
  for (const [index, destination] of ['', 'storybook', '0.2.0dev', '0.2.0dev/storybook'].entries()) {
    cpSync(inputs[index], join(staging, destination), { recursive: true, errorOnExist: true })
  }
  const manifest = {
    schema: 1,
    legacy: { version: '0.1.1', sha: '073de432fc4a66a4425d018eed95776e75a5cc7e' },
    dev: { label: '0.2.0dev2', sha, dirty: argv.includes('--dirty') },
    files: inventory(staging),
  }
  writeFileSync(join(staging, 'provenance.json'), JSON.stringify(manifest, null, 2) + '\n')
  writeFileSync(join(staging, '.nojekyll'), '')
  if (existsSync(output)) {
    assert(
      existsSync(join(output, 'provenance.json')),
      'Refusing to replace an output without assembly provenance',
    )
    previous = `${output}.previous-${digest(readFileSync(join(output, 'provenance.json'))).slice(0, 12)}-${Date.now()}`
    renameSync(output, previous)
  }
  renameSync(staging, output)
  if (previous) console.log(`Previous valid assembly retained: ${previous}`)
  console.log(
    `Pages assembled locally: ${output}; dev ${sha}${manifest.dev.dirty ? ' (dirty local proof)' : ''}`,
  )
} catch (error) {
  if (previous && !existsSync(output)) renameSync(previous, output)
  throw error
} finally {
  if (existsSync(staging)) rmSync(staging, { recursive: true, force: true })
}
