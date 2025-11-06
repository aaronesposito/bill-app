import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,          // listens on 0.0.0.0 in the container
    port: 5004,
    strictPort: true,
    watch: {
      usePolling: true,  // match CHOKIDAR_USEPOLLING
      interval: 100      // tweak if needed
    },
    hmr: {
      host: 'localhost', // what your browser uses to reach the app
      port: 5004
      // If you access via http://127.0.0.1:5004, set host: '127.0.0.1'
    }
  },
  css: { modules: { localsConvention: 'camelCaseOnly' } }
})