import {createRouter, createWebHistory} from 'vue-router'
import {asyncRoutes, loginRoute, staticRoutes} from "@/router/routes.ts";


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        loginRoute,
        {
            path: '/',
            redirect: "/home",
            component: () => import("@/views/layout/index.vue"),
            children: [
                ...asyncRoutes,
            ]
        },
        ...staticRoutes,
    ],
})
// router.beforeEach((to, from, next) => {
// const token = localStorage.getItem("");
// if (token) {
//   if (to.path === "/login") {
//     next("/");
//   } else {
//     // 存在用户信息
//     next();
//     const { userInfo } = store.getters;
//     if (userInfo.userId) {
//       next();
//     } else {
//       store
//         .dispatch("user/logout")
//         .then(() => {
//           Message.success("退出登录成功");
//         })
//         .catch((error) => {
//           Message.error(error);
//         });
//     }
//   }
// } else {
//   localStorage.removeItem("");
//   if (to.path === "/login") {
//     next();
//   } else {
//     next("/login");
//   }
// }
// })
export default router
