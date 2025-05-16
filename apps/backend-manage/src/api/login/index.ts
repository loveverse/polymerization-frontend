import http from "@/utils/http";
import { ReqLoginForm, ResLogin, UserMenuReq } from "./types";
import { RolePageRes } from "../system/types";

export const reqLogin = (params: ReqLoginForm) =>
  http.post<ResLogin>("/embodied-user-api/manager/context/v1/login", params);

// 页面初始化
export const reqUserRole = () =>
  http.post<RolePageRes[]>("/embodied-user-api/manager/context/v1/roles");
export const reqUserMenu = (params: RolePageRes[]) =>
  http.post<UserMenuReq[]>("/embodied-user-api/manager/context/v1/menus", params);
export const reqUserPermission = (params: RolePageRes[]) =>
  http.post("/embodied-user-api/manager/context/v1/permissions", params);

// 退出登录
export const reqLogOut = () => http.post("/embodied-user-api/manager/context/v1/logout");
