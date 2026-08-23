import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'node:path'

// Compatibility build for direct <script> usage. React and ReactDOM remain peer globals,
// while react/jsx-runtime is bundled so consumers do not need a non-standard third global.
export default defineConfig({
  publicDir: false,
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'BauhausUI',
      formats: ['umd'],
      fileName: () => 'bauhaus-ui.umd.cjs',
      cssFileName: 'style',
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
    cssCodeSplit: false,
  },
})
