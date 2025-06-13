import {Suspense, useEffect, useRef, useState} from "react";
import {message} from "antd";
import {useLocation, useNavigate} from "react-router-dom";
import Router, {AppRouteObject} from "./index";
import AppContext, {defaultDict, Dict, DictItemData} from "@/context";
import {reqDictItemCollect, reqUserInfo,} from "@/api/system";
import {SpinLoading} from "@/components";
import {layoutRoutes} from "./routes";
import {DictItemDataRes, UserInfoRes} from "@/api/system/types";
import {filterRoutesByUserRoutes} from "@/router/hooks";
import {WHITE_ROUTES} from "@/utils/constant";

// 处理登录后，页面初始化时的钩子
function BeforeRouterEnter() {
  const location = useLocation();
  const navigate = useNavigate();
  const storeUserInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const [dict, setDict] = useState<Dict>(defaultDict);
  const [userInfo, setUserInfo] = useState<UserInfoRes | null>(null)
  const [permissionRoutes, setPermissionRoutes] = useState<AppRouteObject[]>([]); // 权限路由
  const [loading, setLoading] = useState(false);
  const isLoaded = useRef(false); // 判断是否已经加载

  const getDictList = async () => {
    const res4 = await reqDictItemCollect()
    if (res4.code === 200) {
      // 遍历dictMap的每个键
      const dictMap: { [key: string]: DictItemData[] } = Object.fromEntries(
        Object.entries(res4.data.dictMap).map(([key, items]) => [
          key,
          items.map((item: DictItemDataRes): DictItemData => {
            return {
              ...item,
              value: item.dictItemValue,
              label: item.dictItemLabel
            };
          })
        ])
      );
      const dict: Dict = {
        dictMap,
        dictKeyMap: res4.data.dictKeyMap,
        getDictItemList: function (type: string) {
          return this.dictMap[type] || [];
        },
        getDictItemMap: function (type: string, value: string) {
          return typeof this.dictMap[type] === "object" ? this.dictKeyMap[type][value] : "";
        },
      };
      setDict(dict);
      if (process.env.NODE_ENV === "development") {
        console.info("%c [ 字典值 ]-83", "font-size:13px; background:pink; color:#bf2c9f;", {
          dictMap: dict.dictMap,
          dictKeyMap: dict.dictKeyMap,
        });
      }
    } else {
      message.error("获取字典信息失败，请刷新重试！");
    }
  };
  const getUserInfo = async () => {
    setLoading(true)
    const res = await reqUserInfo({id: storeUserInfo.id});
    if (res.code !== 200) {
      setLoading(false)
      message.error(res.msg);
      return
    }
    setUserInfo(res.data)
    // 继续获取权限和菜单信息
    // // true：本地路由，false: 线上路由
    if (process.env.NODE_ENV === "development") {
      setPermissionRoutes(layoutRoutes);
    } else {
      const userPermissionRoutes = filterRoutesByUserRoutes(layoutRoutes, []);
      setPermissionRoutes(userPermissionRoutes);
    }
    isLoaded.current = true
    setLoading(false)
  }

  useEffect(() => {
    if (WHITE_ROUTES.includes(location.pathname)) {
      return;
    }
    const token = localStorage.getItem("backend-token");
    if (!token) {
      navigate("/login", {replace: true});
      return;
    }
    if (!Object.keys(dict.dictMap).length) {
      void getDictList();
    }
    if (!userInfo) {
      void getUserInfo()
    }

  }, [location.pathname]);
  // 可以直接在 html 文件中添加 loading 效果
  if (loading) {
    return <SpinLoading variant="full"/>;
  }

  return (
    <Suspense fallback={<SpinLoading variant="full"/>}>
      <AppContext.Provider
        value={{dict, setDict, userInfo, setUserInfo, permissionRoutes, setPermissionRoutes}}>
        <Router permissionRoutes={permissionRoutes} isLoaded={isLoaded.current}/>
      </AppContext.Provider>
    </Suspense>
  );
}

export default BeforeRouterEnter;
