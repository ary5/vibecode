import { defineConfig, type PluginOption } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(async ({ command }) => {
  const plugins: PluginOption[] = [react()]

  if (command === 'serve') {
    const { default: mkcert } = await import('vite-plugin-mkcert')
    plugins.push(mkcert())
  }

  return {
    plugins,
    server: {
      host: true,
      https: true,
    },
  }
})
