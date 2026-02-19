import { defineConfig } from 'vite'

export default defineConfig({
  base: '/clinical-wiki/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
