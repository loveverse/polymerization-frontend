
import { fileURLToPath, URL } from "node:url"

import { defineConfig, loadEnv } from "vite"
import vue from "@vitejs/plugin-vue"
import AutoImport from "unplugin-auto-import/vite"
import Components from "unplugin-vue-components/vite"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"
import VueSetupExtend from "vite-plugin-vue-setup-extend"
// @ts-ignore 忽略类型检查错误
import eslint from "vite-plugin-eslint";


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
      eslint({
        lintOnStart: true, // 启动时检查
        emitWarning: true, // 输出警告到控制台
        emitError: true, // 输出错误到控制台
        failOnWarning: false, // 警告不阻断构建
        failOnError: false, // 错误不阻断构建（生产环境可设为 true）
      })
    ],
    server: {
      port: 40300,
      open: true,
      cors: true,
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
          additionalData: `@use '@/styles/variables.scss' as *;`,
        },
      },
    },
  }
})
