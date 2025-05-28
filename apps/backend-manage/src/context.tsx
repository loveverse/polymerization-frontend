import React, {createContext, useContext} from "react";
import {AppRouteObject} from "./router";
import {UserInfo} from "./api/base/common/types";
import {DictItemCollectRes, DictItemDataRes} from "@/api/system/types";

export interface DictItemData extends DictItemDataRes{
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
  setDict: React.Dispatch<React.SetStateAction<Dict>>;
  userInfo: UserInfo | null;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo | null>>;
  permissionRoutes: AppRouteObject[];
  setPermissionRoutes: React.Dispatch<React.SetStateAction<AppRouteObject[]>>;
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
