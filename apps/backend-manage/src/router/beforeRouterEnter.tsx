import { Suspense, useEffect, useRef, useState } from "react";
import { message } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { reqUserMenu, reqUserPermission, reqUserRole } from "@/api/login";
import Router, { AppRouteObject } from "./index";
import AppContext, { defaultDicts } from "@/context";
import { reqDictDetail, reqDictList } from "@/api/system";
import { SpinLoading } from "@/components";
import { reqUserInfo } from "@/api/base";
import { UserInfo } from "@/api/base/types";
import { layoutRoutes } from "./routes";
import { filterRoutesByUserRoutes } from "./hooks";

// 处理登录后，页面初始化时的钩子
function BeforeRouterEnter() {
  const location = useLocation();
  const navigate = useNavigate();

  const [dicts, setDicts] = useState<Dicts>(defaultDicts);
  const [permissionRoutes, setPermissionRoutes] = useState<AppRouteObject[]>([]); // 权限路由
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const isLoaded = useRef(false); // 判断是否已经加载

  const fetchUserInfo = async () => {
    const res = await reqUserInfo();
    if (res.code === 200) {
      setUserInfo(res.data);
    } else {
      localStorage.removeItem("backend-token");
      navigate("/login");
      message.error(res.msg);
    }
  };
  const getInitData = async () => {
    setLoading(true);
    try {
      const res1 = await reqUserRole();
      if (res1.code === 200) {
        const [res2, res3, res4, res5] = await Promise.all([
          reqUserMenu(res1.data),
          reqUserPermission(res1.data),
          reqDictList(),
          reqDictDetail(),
        ]);
        if ([res2, res3, res4, res5].every((k) => k.code === 200)) {
          const detail: Dict = {};
          res5.data.forEach((itemSub: DictItem) => {
            const list: DictItem[] = detail[itemSub.dictId] || [];
            list.push(itemSub);
            detail[itemSub.dictId] = list;
          });
          const label: Label = {};
          const dict: Dict = {};
          res4.data.forEach((item: DictItem) => {
            const details = detail[item.dictId];
            // 字典详情
            dict[item.name] = details;
            // 字典对象
            label[item.name] = {};
            if (dict[item.name]) {
              dict[item.name].forEach((k: DictItem) => {
                label[item.name][k.value] = k.label;
              });
            }
          });
          const dicts: Dicts = {
            dict: dict,
            label: label,
            getDict: function (type: string) {
              return this.dict[type] || [];
            },
            getLabel: function (type: string, value: string) {
              return typeof this.label[type] === "object" ? this.label[type][value] : "";
            },
          };

          setDicts(dicts);
          // true：本地路由，false: 线上路由
          if (process.env.NODE_ENV === "development") {
            setPermissionRoutes(layoutRoutes);
            console.log("%c [ 字典值 ]-83", "font-size:13px; background:pink; color:#bf2c9f;", {
              dict,
              label,
            });
          } else {
            const userPermissionRoutes = filterRoutesByUserRoutes(layoutRoutes, res2.data);
            setPermissionRoutes(userPermissionRoutes);
          }
        } else {
          message.error("获取初始化信息失败，请刷新重试！");
        }
      } else {
        message.error(res1.msg);
      }
    } catch (error) {
      message.error("系统繁忙，请刷新重试！");
      navigate("/500");
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
    // if (!userInfo) {
    //   fetchUserInfo();
    // }
    // if (!Object.keys(dicts.dict).length) {
    //   getInitData();
    // }
    setPermissionRoutes(layoutRoutes);
  }, [location.pathname]);

  if (loading) {
    return <SpinLoading variant="full" />;
  }

  return (
    <Suspense fallback={<SpinLoading variant="full" />}>
      <AppContext.Provider
        value={{ permissionRoutes, setPermissionRoutes, dicts, setDicts, userInfo, setUserInfo }}>
        <Router permissionRoutes={permissionRoutes} isLoaded={isLoaded.current} />
      </AppContext.Provider>
    </Suspense>
  );
}
export default BeforeRouterEnter;
