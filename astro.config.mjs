import { defineConfig } from 'astro/config'

export default defineConfig({
  outDir: 'docs',
  build: {
    format: 'preserve',
  },
  devToolbar: {
    enabled: false,
  },
  server: {
    port: 3000,
  },
})
