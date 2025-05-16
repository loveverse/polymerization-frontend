import React from "react";
import { Params, RouteObject, useRoutes } from "react-router-dom";
import { errorRoutes, loginRoute, staticRoutes } from "./routes";
import Layout from "@/views/layout";
import AuthRouter from "./AuthRouter";

export interface RouteMeta {
  /**
   * antd menu selectedKeys
   */
  key?: string;
  /**
   * menu label, i18n
   */
  label?: string;
  /**
   * menu prefix icon
   */
  icon?: React.ReactNode | string;
  /**
   * 菜单不需要权限
   */
  permission?: boolean;
  /**
   * menu suffix icon
   */
  suffix?: React.ReactNode;
  /**
   * hide in menu
   */
  hideMenu?: boolean;
  /**
   * hide in multi tab
   */
  hideTab?: boolean;
  /**
   * disable in menu
   */
  disabled?: boolean;
  /**
   * react router outlet
   */
  outlet?: any;
  /**
   * use to refresh tab
   */
  timeStamp?: string;
  /**
   * external link and iframe need
   */
  frameSrc?: string;
  /**
   * dynamic route params
   *
   * @example /user/:id
   */
  params?: Params<string>;
}
export type AppRouteObject = {
  order?: number;
  meta?: RouteMeta;
  children?: AppRouteObject[];
} & Omit<RouteObject, "children">;

export default function Router({
  permissionRoutes,
  isLoaded,
}: {
  isLoaded: boolean;
  permissionRoutes: AppRouteObject[];
}) {
  const routes: AppRouteObject[] = [
    loginRoute,
    {
      path: "/",
      element: (
        <AuthRouter isLoaded={isLoaded}>
          <Layout />
        </AuthRouter>
      ),
      children: [...staticRoutes, ...permissionRoutes, ...errorRoutes],
    },
  ];
  const router = useRoutes(routes as unknown as RouteObject[]);
  return router;
}
