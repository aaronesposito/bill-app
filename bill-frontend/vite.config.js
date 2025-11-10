import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,          // listens on 0.0.0.0 in the container
    port: 5004,
    strictPort: true,
  },
  css: { modules: { localsConvention: 'camelCaseOnly' } }
})