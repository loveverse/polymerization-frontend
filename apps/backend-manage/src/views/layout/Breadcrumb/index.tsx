import { useMemo } from "react";
import { Breadcrumb } from "antd";
import { Link, useLocation } from "react-router-dom";
import { AppRouteObject } from "@/router";
import { generateBreadcrumbNameMap } from "@/router/hooks";

const CustomBreadcrumb = (props: { userMenu: AppRouteObject[] }) => {
  const { userMenu } = props;
  const location = useLocation();
  const pathSnippets = location.pathname.split("/").filter((x) => x);
  const breadcrumbNameMap = useMemo(() => generateBreadcrumbNameMap(userMenu), [userMenu]);

  const breadcrumbItems = pathSnippets
    .map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
      // 如果是最后一项，即当前页面路由，渲染文本不可点击跳转
      if (index + 1 === pathSnippets.length)
        return {
          key: url,
          title: breadcrumbNameMap.get(url),
        };
      // 其余用link标签可点击跳转（注意：上级路由默认跳转到其定义的重定向路由，例如/system跳转至/system/user）
      return {
        key: url,
        title: <Link to={url}>{breadcrumbNameMap.get(url)}</Link>,
      };
    })
    .filter((k) => k.title);

  return <Breadcrumb items={breadcrumbItems}></Breadcrumb>;
};

export default CustomBreadcrumb;
