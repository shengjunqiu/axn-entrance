import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { reportWritingPlugin } from './server/report-writing.ts'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), reportWritingPlugin(loadEnv(mode, process.cwd(), 'AI_'))],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    // 监听所有网卡，方便通过 192.168.77.1:5177 调试
    host: true,
    port: 5177,
    strictPort: true,
  },
}))
