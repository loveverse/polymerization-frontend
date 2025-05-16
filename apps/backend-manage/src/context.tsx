import { createContext, useContext } from "react";
import { AppRouteObject } from "./router";
import { UserInfo } from "./api/base/common/types";

interface AppContextType {
  dicts: Dicts;
  setDicts: React.Dispatch<React.SetStateAction<Dicts>>;
  userInfo: UserInfo | null;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo | null>>;
  permissionRoutes: AppRouteObject[];
  setPermissionRoutes: React.Dispatch<React.SetStateAction<AppRouteObject[]>>;
}

export const defaultDicts: Dicts = {
  dict: {},
  label: {},
  getDict: () => [],
  getLabel: () => "",
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

const { Provider, Consumer } = AppContext;
export { Provider, Consumer };
export default AppContext;
