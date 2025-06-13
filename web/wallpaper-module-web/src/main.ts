import {createApp} from 'vue'
import {createPinia} from 'pinia'
import App from './App.vue'
import router from './router'
import GlobalComponents from "@/components";
import Directives from "@/utils/directive.ts";

import 'element-plus/dist/index.css'
import './assets/css/main.scss'
import "animate.css"
import {check} from "@/utils/common.ts";

// 生产环境时防止debugger
if (import.meta.env.PROD) {
  check()
}


const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(GlobalComponents)
app.use(Directives)

app.mount('#app')
