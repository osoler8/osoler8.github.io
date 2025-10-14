import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT: base must match the repository name for GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: '/generador-dictats/',
})
