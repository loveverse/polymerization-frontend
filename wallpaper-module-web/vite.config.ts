import {fileURLToPath, URL} from 'node:url'

import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

console.log("[ 打包] >", process.env);
// https://vite.dev/config/
export default defineConfig(({mode, command}) => {
  const env = loadEnv(mode, process.cwd(), "")
  return {
    base: command === "serve" ? "/" : JSON.stringify(env.VITE_PUBLIC_PATH),
    plugins: [
      vue(),
      // vueDevTools(),
    ],
    server: {
      port: 40200,
      proxy: {}
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          //   "@use '@/assets/css/variables.scss' as *; @import '@/assets/css/base.scss';",
          // 全局引入后，不需要在其他文件引入
          additionalData: `@use '@/assets/css/global.scss' as *;`
        }
      }
    }
  }
})
