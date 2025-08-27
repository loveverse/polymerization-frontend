import { RouteRecordRaw } from "vue-router"
import Home from "@/views/home/index.vue"

const ComLayout = () => import("@/components/ComLayout/index.vue")

// 静态路由，不存在路由菜单默认显示的
export const staticRoutes: RouteRecordRaw[] = [
  {
    path: "/home",
    name: "home",
    component: Home,
    meta: {
      label: "首页",
      keepAlive: true,
    },
  },
]

// 动态路由
export const dynamicRoutes: RouteRecordRaw[] = [
  {
    path: "/project",
    name: "project",
    component: ComLayout,
    meta: { label: "项目" },
    redirect: "/project/chat",
    children: [
      {
        path: "/project/chat",
        name: "chat",
        component: () => import("@/views/project/chatRoom/index.vue"),
        meta: { label: "聊天室" },
      },
      {
        path: "/project/cloudDisk",
        name: "cloudDisk",
        component: () => import("@/views/project/cloudDisk/index.vue"),
        meta: { label: "云盘" },
      },
      {
        path: "/project/wallpaper",
        name: "wallpaper",
        component: () => import("@/views/project/wallpaper/index.vue"),
        meta: { label: "壁纸" },
      },
    ],
  },
  {
    path: "/about",
    name: "about",
    component: () => import("@/views/about/index.vue"),
    meta: { label: "关于" },
  },
]

export const errorRoutes: RouteRecordRaw[] = [
  {
    path: "/403",
    name: "403",
    component: () => import("@/components/ErrorPages/403.vue"),
  },
  {
    path: "/404",
    name: "404",
    component: () => import("@/components/ErrorPages/404.vue"),
  },
  {
    path: "/500",
    name: "500",
    component: () => import("@/components/ErrorPages/500.vue"),
  },
]
