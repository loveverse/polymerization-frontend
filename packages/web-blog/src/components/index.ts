import { App } from "vue"

// 自动导入当前目录下所有的index.vue组件
const components = import.meta.glob("./*/index.vue", { eager: true })

export default {
  install(app: App) {
    Object.entries(components).forEach(([path, module]) => {
      const componentName = path.split("/")[1] // 获取文件名
      if (componentName) {
        app.component(componentName, (module as any).default)
      }
    })
  },
}
