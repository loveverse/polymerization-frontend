import {useCallback} from "react";
import {GetProp, MenuProps} from "antd";
import {AppRouteObject} from "@/router";
import {UserMenuReq} from "@/api/login/types";
import {ComSvgIcon} from "@/components";

export const generateBreadcrumbNameMap = (routerList: AppRouteObject[]) => {
  const map = new Map();

  function traverse(nodes: AppRouteObject[]) {
    nodes.forEach((node) => {
      if (node.meta && node.meta.label) {
        map.set(node.path, node.meta.label);
      }
      if (node.children && node.children.length > 0) {
        traverse(node.children);
      }
    });
  }

  traverse(routerList);

  return map;
};

export function filterRoutesByUserRoutes(
  localRoutes: AppRouteObject[],
  userRoutes: UserMenuReq[]
): AppRouteObject[] {
  // 递归过滤函数，检查是否在 b 中存在并返回对应的菜单
  const filterMenu = (
    localRoutes: AppRouteObject[],
    userRoutes: UserMenuReq[]
  ): AppRouteObject[] => {
    return localRoutes
      .map((localRoute) => {
        // 不需要做权限的路由
        if (localRoute.meta && localRoute.meta.permission) {
          return {...localRoute};
        }
        // 寻找匹配的用户路由
        const matchedUserRoute = userRoutes.find(
          (userRoute) => userRoute.route === localRoute.path
        );

        // 如果找到了匹配的用户路由
        if (matchedUserRoute) {
          // 检查是否需要排除 hideMenu 为 true 的路由
          if (localRoute.meta?.hideMenu) {
            return {...localRoute, order: matchedUserRoute.orderValue}; // 不返回该路由
          }

          // 如果有子路由，递归处理子路由
          const filteredChildren =
            localRoute.children?.length && matchedUserRoute.children?.length
              ? filterMenu(localRoute.children, matchedUserRoute.children)
              : localRoute.children?.length
                ? localRoute.children
                : [];

          return {
            ...localRoute,
            order: matchedUserRoute.orderValue,
            children: filteredChildren.length > 0 ? filteredChildren : undefined,
          };
        }

        return null; // 如果没有匹配的用户路由，返回 null
      })
      .filter((route) => route !== null) as AppRouteObject[]; // 去除 null 值，返回最终过滤后的路由
  };

  // 从 a 中筛选出在 b 中存在的菜单（递归处理多级菜单）
  return filterMenu(localRoutes, userRoutes);
}

type MenuItem = GetProp<MenuProps, "items">[number];

/**
 *
 * @returns 角色对应路由
 */
export function useRouteToMenuFn() {
  const routeToMenuFn = useCallback((items: AppRouteObject[]): MenuItem[] => {
    const sortItems = items.sort((a, b) => Number(a.order) - Number(b.order));
    return sortItems.reduce((pre: MenuItem[], cur) => {
      // 先过滤掉子路由中需要隐藏的，防止children为[]，展示三级菜单
      const child = cur.children && cur.children.filter((k) => !k.meta?.hideMenu && !k.index);
      return cur.index || (cur.meta && cur.meta.hideMenu)
        ? pre
        : pre.concat({
          key: cur.path!,
          label: cur.meta ? cur.meta.label : "",
          disabled: cur.meta ? cur.meta.disabled : false,
          icon: typeof cur.meta?.icon === "string" ?
            <ComSvgIcon alias={cur.meta.icon}/> : cur.meta?.icon,
          children: child?.length ? routeToMenuFn(child) : undefined,
        });
    }, []);
  }, []);
  return routeToMenuFn;
}
