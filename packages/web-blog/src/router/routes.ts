import {RouteRecordRaw} from "vue-router";

const ComLayout = () => import("@/components/ComLayout/index.vue");

export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: "/blog",
    name: "blog",
    component: ComLayout,
    meta: {label: "博客"},
    redirect: "/blog/chat",
    children: [
      {
        path: "/blog/chat",
        name: "chat",
        component: () => import("@/views/blog/chatRoom/index.vue"),
        meta: {label: "聊天室"}
      },
      {
        path: "/blog/cloudDisk",
        name: "cloudDisk",
        component: () => import("@/views/blog/cloudDisk/index.vue"),
        meta: {label: "云盘"}
      },
      {
        path: "/blog/wallpaper",
        name: "wallpaper",
        component: () => import("@/views/blog/wallpaper/index.vue"),
        meta: {label: "壁纸"}
      },
      {
        path: "/blog/about",
        name: "about",
        component: () => import("@/views/blog/wallpaper/index.vue"),
        meta: {label: "壁纸"}
      }
    ]
  },
]

// 静态路由，不存在路由菜单默认显示的
export const staticRoutes: RouteRecordRaw[] = [
  {
    path: "/:path(.*)*",
    component: () => import("@/views/blog/chatRoom/index.vue"),
  },
]
export const loginRoute: RouteRecordRaw = {
  path: "/login",
  name: "login",
  component: () => import("@/views/login/index.vue")
}


