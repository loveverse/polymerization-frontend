import {RouteRecordRaw} from "vue-router";

export const asyncRoutes: RouteRecordRaw[] = [
    {
        path: "/home",
        name: "home",
        component: () => import("@/views/home/index.vue"),
        meta: {
            label: "首页",
        },
    },
    {
        path: "/like",
        name: "like",
        component: () => import("@/views/like/index.vue"),
        meta: {
            label: "喜欢",
        }
    },
    {
        path: "/search",
        name: "search",
        component: () => import("@/views/search/index.vue"),
        meta: {
            label: "搜索",
        },
    }
]

// 静态路由，不存在路由菜单默认显示的
export const staticRoutes: RouteRecordRaw[] = [
    {
        path: "/:path(.*)*",
        component: () => import("@/views/home/index.vue"),
    },
]
export const loginRoute: RouteRecordRaw = {
    path: "/login",
    name: "login",
    component: () => import("@/views/login/index.vue")
}


