import { useAppContext } from "@/context";

interface AuthRouterProps {
  isLoaded: boolean;
  children: JSX.Element;
}
const AuthRouter = ({ isLoaded, children }: AuthRouterProps) => {
  const { dict, userInfo } = useAppContext();
  // 白名单路由
  // const whiteRoutes = ["/login"];
  // if (whiteRoutes.includes(pathname)) {
  //   return props.children;
  // }

  const token = localStorage.getItem("backend-token");
  if (!token) {
    return children;
  }
  // if (!Object.keys(dicts.dict).length || !userInfo || !isLoaded) {
  //   return null;
  // }

  // 路由鉴权，请求的路由 没有的跳转404
  // const routerList = flattenRoutes(props.userRoutes);

  // if (!routerList.find((k) => pathname.includes(k)) && props.userRoutes.length) {
  //   return <Navigate to="/404" replace />;
  // }
  return children;
};

export default AuthRouter;
