import { fileURLToPath, URL } from "node:url"

import { defineConfig, loadEnv } from "vite"
import vue from "@vitejs/plugin-vue"
import AutoImport from "unplugin-auto-import/vite"
import Components from "unplugin-vue-components/vite"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"
import VueSetupExtend from "vite-plugin-vue-setup-extend"

console.info("[ 打包] >", process.env)
// https://vite.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), "")
  return {
    base: command === "serve" ? "/" : JSON.stringify(env.VITE_PUBLIC_PATH),
    plugins: [
      vue(),
      VueSetupExtend(),
      // vueDevTools(),
      AutoImport({
        resolvers: [ElementPlusResolver({ importStyle: "sass" })],
        imports: [
          "vue",
          {
            "element-plus": [
              "ElMessage",
              "ElMessage",
              "ElMessageBox",
              "ElNotification",
              "ElLoading",
            ],
          },
        ], // 自动导入的库
        dts: "./src/types/auto-imports.d.ts",
        eslintrc: {
          enabled: true,
          filepath: "./.eslintrc-auto-import.json",
        },
      }),
      Components({
        // 必须加上importStyle，不然样式覆盖失效
        resolvers: [ElementPlusResolver({ importStyle: "sass" })],
        dts: "./src/types/components.d.ts",
      }),
    ],
    server: {
      port: 40300,
      proxy: {},
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          //   "@use '@/assets/css/variables.scss' as *; @import '@/assets/css/base.scss';",
          // 全局引入后，不需要在其他文件引入
          additionalData: `@use '@/assets/css/global.scss' as *;`,
        },
      },
    },
  }
})
