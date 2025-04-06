import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    cors: true,
    proxy: {
      "/question-capture-tool": {
        target: "https://imzujuan.xkw.com",
        changeOrigin: true,
        rewrite(path) {
          return path.replace(/^\/question-capture-tool/, '')
        },
      }
    }
  }
})
