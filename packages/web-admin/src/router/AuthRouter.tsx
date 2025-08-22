import {useAppContext} from "@/context";
import {useLocation} from "react-router-dom";
import {JSX} from "react";
import {WHITE_ROUTES} from "@/utils/constant";

interface AuthRouterProps {
  isLoaded: boolean;
  children: JSX.Element;
}

const AuthRouter = ({isLoaded, children}: AuthRouterProps) => {
  const {dict, userInfo} = useAppContext();
  const {pathname} = useLocation()
  // 检查是否在白名单路由中
  if (WHITE_ROUTES.includes(pathname)) {
    return children;
  }
  // 检查token
  const token = localStorage.getItem("backend-token");
  if (!token) {
    return null;
  }
  // 检查数据是否加载完成
  if (!Object.keys(dict.dictMap).length || !userInfo || !isLoaded) {
    return null;
  }
  // 路由鉴权，请求的路由 没有的跳转404
  // const routerList = flattenRoutes(props.userRoutes);

  // if (!routerList.find((k) => pathname.includes(k)) && props.userRoutes.length) {
  //   return <Navigate to="/404" replace />;
  // }
  return children;
};

export default AuthRouter;
