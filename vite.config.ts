import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'

export default defineConfig(({ command }) => ({
  plugins: [react(), ...(command === 'serve' ? [mkcert()] : [])],
  server: {
    host: true,
    https: true,
  },
}))
