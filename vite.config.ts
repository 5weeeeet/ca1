import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@/components/ui': '@/src/components/ui',
    },
  },
  root: process.cwd(),
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  publicDir: 'public',
  // Явное указание на файл index.html
  appType: 'spa',
})