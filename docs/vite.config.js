import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // "@"를 입력하면 자동으로 "src" 폴더를 가리키게 설정하네
      "@": path.resolve(__dirname, "./src"),
    },
  },
})