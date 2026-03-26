import path from 'node:path'
import { crx } from '@crxjs/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import zip from 'vite-plugin-zip-pack'
import tailwindcss from '@tailwindcss/vite'
import manifest from './manifest.config.js'
import { name, version } from './package.json'

export default defineConfig({
  resolve: {
    alias: {
      '@': `${path.resolve(__dirname, 'src')}`,
    },
  },
  plugins: [
    tailwindcss(),
    react(),
    crx({ manifest }),
    zip({ outDir: 'release', outFileName: `crx-${name}-${version}.zip` }),
  ],
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173, // 포트를 명시적으로 넣어서 ws://localhost:5173 이 되게 해야 하네!
    },
    cors: {
      origin: [
        /chrome-extension:\/\//,
        'http://localhost:5173'
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    },
  },
})