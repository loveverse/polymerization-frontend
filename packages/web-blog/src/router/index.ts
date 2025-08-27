import { createRouter, createWebHashHistory } from "vue-router"
import { dynamicRoutes, errorRoutes, staticRoutes } from "@/router/routes.ts"

const router = createRouter({
  history: createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH),
  routes: [
    // 如果需要登录进入系统，在这里编写
    {
      path: "/",
      redirect: "/home",
      component: () => import("@/views/layout/index.vue"),
      children: [...staticRoutes, ...dynamicRoutes, ...errorRoutes],
    },
  ],
})

router.beforeEach(async (to, _from, next) => {
  next()
})
export default router
