import React, { Suspense } from "react";

/**
 * @description 路由懒加载
 * @param {Element} children 需要访问的组件
 * @returns element
 */
// 暂时不加SpinLoading占位
const lazyLoad = (children: React.ReactNode): React.ReactNode => {
  return <Suspense>{children}</Suspense>;
};

export default lazyLoad;
