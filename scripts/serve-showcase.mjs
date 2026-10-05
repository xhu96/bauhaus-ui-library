import { createServer } from 'node:http'
import { readFileSync, statSync } from 'node:fs'
import { extname, resolve, sep } from 'node:path'

const site = resolve('dist-site')
const stories = resolve('storybook-static')
const contentTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
}
createServer((request, response) => {
  try {
    const path = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)
    const isStory = path.startsWith('/storybook/')
    const root = isStory ? stories : site
    let file = resolve(root, '.' + (isStory ? path.slice('/storybook'.length) : path))
    if (file !== root && !file.startsWith(root + sep)) throw new Error('Invalid path')
    if (statSync(file).isDirectory()) file = resolve(file, 'index.html')
    response.writeHead(200, {
      'Content-Type': contentTypes[extname(file)] ?? 'application/octet-stream',
      'Cache-Control': 'no-store',
    })
    response.end(readFileSync(file))
  } catch {
    response.writeHead(404)
    response.end('Not found')
  }
}).listen(4191, '127.0.0.1', () => console.log('Built showcase and documentation: http://127.0.0.1:4191/'))
