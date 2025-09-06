import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@shared': path.resolve(__dirname, './shared'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: [
      '8865a5ca-c050-42d8-a9a0-b57ce8801082-00-1072s6kzzp6tz.janeway.replit.dev',
      'localhost',
      '127.0.0.1',
      '0.0.0.0'
    ]
  }
})