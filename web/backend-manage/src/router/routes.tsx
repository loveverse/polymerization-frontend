import Login from "@/views/login";

/* 首页 */
import Home from "@/views/home";
import ModuleManage from "@/views/module";

/* 系统设置 */
import UserManage from "@/views/system/user";
import DictManage from "@/views/system/dict";
import RoleManage from "@/views/system/role";
import MenuManage from "@/views/system/menu";

import {NotAuth, NotFound, ServerError} from "@/components";

import {Navigate, Outlet} from "react-router-dom";
import {AppRouteObject} from ".";
import {
  HomeOutlined, InboxOutlined,
  ProductOutlined,
  RobotOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined
} from "@ant-design/icons";
import React from "react";
import lazyLoad from "@/router/lazyLoad";


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
    meta: {label: "首页", permission: true, icon: <HomeOutlined/>},
  },
];

// 动态路由
export const asyncRoutes: AppRouteObject[] = [
  {
    path: "/module",
    element: lazyLoad(<ModuleManage/>),
    meta: {label: "模块管理", icon: <InboxOutlined/>}
  },
  {
    path: "/system",
    element: <Outlet/>,
    meta: {label: "系统设置", icon: <SettingOutlined/>},
    children: [
      {
        index: true,
        element: <Navigate to="/system/user" replace/>,
      },
      {
        path: "/system/user",
        element: lazyLoad(<UserManage/>),
        meta: {label: "用户管理", icon: <UserOutlined/>},
      },
      {
        path: "/system/role",
        element: lazyLoad(<RoleManage/>),
        meta: {label: "角色管理", icon: <TeamOutlined/>},
      },
      {
        path: "/system/menu",
        element: lazyLoad(<MenuManage/>),
        meta: {label: "菜单管理", icon: <ProductOutlined/>},
      },
      {
        path: "/system/dict",
        element: lazyLoad(<DictManage/>),
        meta: {label: "字典管理", icon: <RobotOutlined/>},
      },
    ],
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
