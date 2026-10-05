import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { resolve as resolvePath } from 'node:path'

// Dev / demo-site config. For the publishable library build see vite.lib.config.ts.
// Relative base in production so the showcase works under the GitHub Pages subpath.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? './' : '/',
  plugins: [react()],
  build: {
    outDir: 'dist-site',
    rollupOptions: {
      input: {
        main: resolvePath(fileURLToPath(new URL('.', import.meta.url)), 'index.html'),
        bau: resolvePath(fileURLToPath(new URL('.', import.meta.url)), 'bau/index.html'),
        settings: resolvePath(fileURLToPath(new URL('.', import.meta.url)), 'examples/settings/index.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}))
