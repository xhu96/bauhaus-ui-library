import { createServer } from 'node:http'
import { readFileSync, statSync } from 'node:fs'
import { resolve, sep, extname } from 'node:path'
const root = resolve(process.argv[2] || '')
const port = Number(process.env.PORT || 4192)
if (!process.argv[2]) throw new Error('Usage: node scripts/serve-consumers.mjs RETAINED_FIXTURES')
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' }
createServer((request, response) => {
  try {
    const path = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)
    const match = /^\/react(18|19)\/(.*)$/.exec(path)
    if (!match) {
      response.writeHead(404)
      response.end('Use /react18/ or /react19/')
      return
    }
    const base = resolve(root, `react${match[1]}`, 'browser')
    let file = resolve(base, match[2] || 'index.html')
    if (!file.startsWith(base + sep)) throw new Error('Invalid path')
    if (statSync(file).isDirectory()) file = resolve(file, 'index.html')
    response.writeHead(200, {
      'Content-Type': types[extname(file)] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    })
    response.end(readFileSync(file))
  } catch {
    response.writeHead(404)
    response.end('Not found')
  }
}).listen(port, '127.0.0.1', () =>
  console.log(`Consumer fixtures: http://127.0.0.1:${port}/react18/ and /react19/ (also cjs.html, umd.html)`),
)
