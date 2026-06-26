import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: 'to-do-app-vite',

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },

  scripts: {
    dev: 'vite',
    build: 'vite build',
    deploy: 'npm run build && gh-pages -d dist',
  },

  server: {
    port: 5173,
    open: true,
  },

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
