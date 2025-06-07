import {Suspense, useEffect, useRef, useState} from "react";
import {message} from "antd";
import {useLocation, useNavigate} from "react-router-dom";
import Router, {AppRouteObject} from "./index";
import AppContext, {defaultDict, Dict, DictItemData} from "@/context";
import {reqDictItemCollect,} from "@/api/system";
import {SpinLoading} from "@/components";
import {UserInfo} from "@/api/base/types";
import {layoutRoutes} from "./routes";
import {filterRoutesByUserRoutes} from "./hooks";
import {DictItemDataRes} from "@/api/system/types";


// 处理登录后，页面初始化时的钩子
function BeforeRouterEnter() {
  const location = useLocation();
  const navigate = useNavigate();

  const [dict, setDict] = useState<Dict>(defaultDict);
  const [permissionRoutes, setPermissionRoutes] = useState<AppRouteObject[]>([]); // 权限路由
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const isLoaded = useRef(false); // 判断是否已经加载

  const getInitData = async () => {
    setLoading(true);
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
      // true：本地路由，false: 线上路由
      if (process.env.NODE_ENV === "development") {
        setPermissionRoutes(layoutRoutes);
        console.log("%c [ 字典值 ]-83", "font-size:13px; background:pink; color:#bf2c9f;", {
          dictMap: dict.dictMap,
          dictKeyMap: dict.dictKeyMap,
        });
      } else {
        const userPermissionRoutes = filterRoutesByUserRoutes(layoutRoutes, []);
        setPermissionRoutes(userPermissionRoutes);
      }
    } else {
      message.error("获取初始化信息失败，请刷新重试！");
    }
    isLoaded.current = true;
    setLoading(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("backend-token");
    if (!token) {
      navigate("/login");
      return;
    }
    if (!Object.keys(dict.dictMap).length) {
      void getInitData();
    }
    setPermissionRoutes(layoutRoutes);
  }, [location.pathname]);

  if (loading) {
    return <SpinLoading variant="full"/>;
  }

  return (
    <Suspense fallback={<SpinLoading variant="full"/>}>
      <AppContext.Provider
        value={{permissionRoutes, setPermissionRoutes, dict, setDict, userInfo, setUserInfo}}>
        <Router permissionRoutes={permissionRoutes} isLoaded={isLoaded.current}/>
      </AppContext.Provider>
    </Suspense>
  );
}

export default BeforeRouterEnter;
