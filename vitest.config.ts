import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig, configDefaults } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    // Never scan nested git worktrees (they carry their own node_modules → a
    // second React copy that breaks hook-based tests).
    exclude: [...configDefaults.exclude, '**/.worktrees/**'],
  },
})
