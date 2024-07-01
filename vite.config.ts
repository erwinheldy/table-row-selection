import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import { generate } from 'fast-dts'
import pkg from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: false,
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, pkg.source),
      name: pkg.libName,
      formats: ['es', 'iife'],
      fileName: format => `${pkg.name}.${format === 'es' ? 'esm.js' : 'js'}`,
    },
  },
  plugins: [
    {
      name: 'dts',
      async closeBundle() {
        await generate(pkg.source, pkg.types)
      },
    },
  ],
})
