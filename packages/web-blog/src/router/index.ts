import { createRouter, createWebHistory } from "vue-router"
import { asyncRoutes, loginRoute, staticRoutes } from "@/router/routes.ts"
import { usePermissionStoreHook } from "@/store/permission"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    loginRoute,
    {
      path: "/",
      redirect: "/home",
      component: () => import("@/views/layout/index.vue"),
      children: [...asyncRoutes],
    },
    ...staticRoutes,
  ],
})

let initialized = false
router.beforeEach(async (to, _from, next) => {
  const permissionStore = usePermissionStoreHook()
  if (!initialized) {
    initialized = true
    // 从本地或接口获取权限码，这里示例从本地缓存读取
    const saved = localStorage.getItem("permission-codes")
    const codes: string[] = saved ? JSON.parse(saved) : [
      "home",
      "blog",
      "blog:chat",
      "blog:cloudDisk",
      "blog:wallpaper",
      "blog:about",
    ]
    permissionStore.setPermissions(codes)
    permissionStore.generateRoutesFromPermissions()
  }
  next()
})
export default router
