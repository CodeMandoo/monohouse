import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import UnoCSS from 'unocss/vite'
import eslint from 'vite-plugin-eslint2'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
    eslint({
      lintInWorker: true,
    }),
    UnoCSS({
      configFile: './uno.config.ts',
    }),
    AutoImport({
      dts: './auto-imports.d.ts',
      imports: ['vue', 'vue-router', 'pinia'],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
})
