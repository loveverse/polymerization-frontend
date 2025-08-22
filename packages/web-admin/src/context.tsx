import React, {createContext, useContext} from "react";
import {AppRouteObject} from "./router";
import {DictItemCollectRes, DictItemDataRes, UserInfoRes} from "@/api/system/types";

export interface DictItemData extends DictItemDataRes {
  value: string;
  label: string;
}

export interface Dict extends DictItemCollectRes {
  dictMap: {
    [key: string]: DictItemData[]
  }
  getDictItemList: (type: string) => DictItemData[];
  getDictItemMap: (type: string, value: string) => string;
}

interface AppContextType {
  dict: Dict;
  userInfo: UserInfoRes | null; // 用户信息
  permissions: string[];  // 权限标识
  asyncRoutes: AppRouteObject[];  // 动态路由
  actions: {
    setUserInfo: React.Dispatch<React.SetStateAction<UserInfoRes | null>>;
    setAsyncRoutes: React.Dispatch<React.SetStateAction<AppRouteObject[]>>;
    resetAppContext: () => void; // 清除一些缓存信息，比如退出时清除字典信息、路由，避免使用旧的数据
  }
}

export const defaultDict: Dict = {
  dictMap: {},
  dictKeyMap: {},
  getDictItemList: () => [],
  getDictItemMap: () => "",
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

const {Provider, Consumer} = AppContext;
export {Provider, Consumer};
export default AppContext;
