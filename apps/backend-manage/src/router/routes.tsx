import Login from "@/views/login";

/* 首页 */
import Home from "@/views/home";


import UserManage from "@/views/user";
/* 系统设置 */
import Profile from "@/views/system/profile";
import SystemDict from "@/views/system/dict";
import RoleManage from "@/views/system/role";
import MenuManage from "@/views/system/menu";

import {Result} from "antd";

import {NotAuth, NotFound, ServerError} from "@/components";


import {Navigate, Outlet} from "react-router-dom";
import {AppRouteObject} from ".";


const Empty = <Result style={{verticalAlign: "middle"}} title="正在开发中..."/>;

// 动态路由
export const asyncRoutes: AppRouteObject[] = [

  {
    path: "/user",
    element: <UserManage/>,
    meta: {label: "用户管理", icon: "user"},
  },
  {
    path: "/system",
    element: <Outlet/>,
    meta: {label: "系统设置", icon: "system"},
    children: [
      {
        index: true,
        element: <Navigate to="/system/role" replace/>,
      },
      // 不需要做权限的路由
      {
        path: "/system/profile",
        element: <Profile/>,
        meta: {label: "个人中心", hideMenu: true, permission: true},
      },
      {
        path: "/system/role",
        element: <RoleManage/>,
        meta: {label: "角色管理"},
      },
      {
        path: "/system/menu",
        element: <MenuManage/>,
        meta: {label: "菜单管理"},
      },
      {
        path: "/system/dict",
        element: <SystemDict/>,
        meta: {label: "字典管理"},
      },
    ],
  },
];

export const loginRoute: AppRouteObject = {
  path: "/login",
  element: <Login/>,
};
// 不存在路由菜单时，默认显示
export const staticRoutes: AppRouteObject[] = [
  {
    index: true,
    element: <Navigate to="/home" replace/>,
  },
  {
    path: "/home",
    element: <Home/>,
    meta: {label: "首页", permission: true, icon: "home"},
  },
];
export const errorRoutes: AppRouteObject[] = [
  {
    path: "/403",
    element: <NotAuth/>,
  },
  {
    path: "/404",
    element: <NotFound/>,
  },
  {
    path: "/500",
    element: <ServerError/>,
  },
  {
    path: "*",
    element: <Navigate to="/404" replace/>,
  },
];

// 异步路由，渲染动态路由
export const layoutRoutes: AppRouteObject[] = [...staticRoutes, ...asyncRoutes];
