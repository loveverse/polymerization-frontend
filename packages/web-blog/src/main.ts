import { createApp } from "vue"
import store from "@/store"
import App from "./App.vue"
import router from "@/router"
import GlobalComponents from "@/components"
import Directives from "@/utils/directive.ts"
import { check } from "@/utils/common.ts"

import "element-plus/dist/index.css"
import "./styles/index.scss"
import "animate.css"

// 生产环境时防止debugger
if (import.meta.env.PROD) {
  check()
}

const app = createApp(App)

app.use(store)
app.use(router)
app.use(GlobalComponents)
app.use(Directives)

app.mount("#app")
