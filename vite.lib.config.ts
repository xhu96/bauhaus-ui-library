import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'node:path'

// Library build: emits ESM + UMD bundles and type declarations to /dist.
export default defineConfig({
  // Don't copy the demo site's public/ assets (e.g. favicon.svg) into the package.
  publicDir: false,
  plugins: [
    react(),
    dts({
      include: ['src'],
      exclude: [
        'src/main.tsx',
        'src/App.tsx',
        'src/components/HeroBoard.tsx',
        '**/*.stories.tsx',
        '**/*.test.ts',
        '**/*.test.tsx',
        'src/test/**',
      ],
      // Bundle the whole public type graph (from src/index.ts) into a single
      // dist/index.d.ts; drops stray per-file declarations for internal modules.
      rollupTypes: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'BauhausUI',
      fileName: 'bauhaus-ui',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
        },
      },
    },
    cssCodeSplit: false,
  },
})
