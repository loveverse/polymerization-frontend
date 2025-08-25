import { RouteRecordRaw } from "vue-router"

const ComLayout = () => import("@/components/ComLayout/index.vue")
import Home from "@/views/home/index.vue"

export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: "/home",
    name: "home",
    component: Home,
    meta: {
      title: "首页 - Mindscape博客",
      keepAlive: true,
      code: "home",
      nav: true,
    },
  },
  {
    path: "/blog",
    name: "blog",
    component: ComLayout,
    meta: { label: "博客", code: "blog", nav: true },
    redirect: "/blog/chat",
    children: [
      {
        path: "/blog/chat",
        name: "chat",
        component: () => import("@/views/blog/chatRoom/index.vue"),
        meta: { label: "聊天室", code: "blog:chat", nav: true },
      },
      {
        path: "/blog/cloudDisk",
        name: "cloudDisk",
        component: () => import("@/views/blog/cloudDisk/index.vue"),
        meta: { label: "云盘", code: "blog:cloudDisk", nav: true },
      },
      {
        path: "/blog/wallpaper",
        name: "wallpaper",
        component: () => import("@/views/blog/wallpaper/index.vue"),
        meta: { label: "壁纸", code: "blog:wallpaper", nav: true },
      },
      {
        path: "/blog/about",
        name: "about",
        component: () => import("@/views/blog/about/index.vue"),
        meta: { label: "关于", code: "blog:about", nav: true },
      },
    ],
  },
]

// 静态路由，不存在路由菜单默认显示的
export const staticRoutes: RouteRecordRaw[] = [
  {
    path: "/:pathMatch(.*)*",
    redirect: "/home",
  },
]
export const loginRoute: RouteRecordRaw = {
  path: "/login",
  name: "login",
  component: () => import("@/views/login/index.vue"),
}
