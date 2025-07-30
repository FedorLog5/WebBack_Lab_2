import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  root: './', // или 'frontend' если в общей папке
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'front') // ← путь к новой папке
    }
  }
})
