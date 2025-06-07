import http from "@/utils/http";
import {LoginInfoReq, LoginInfoRes, UserMenuReq} from "./types";
import {RolePageReq} from "../system/types";


export const reqLogin = (params: LoginInfoReq) =>
  http.post<LoginInfoRes>("/auth-api/v1/auth/login", params);
// 退出登录
export const reqLogOut = () => http.post("/auth-api/v1/auth/logout");

// 页面初始化
export const reqUserRole = () =>
  http.post<RolePageReq[]>("/embodied-user-api/manager/context/v1/roles");
export const reqUserMenu = (params: RolePageReq[]) =>
  http.post<UserMenuReq[]>("/embodied-user-api/manager/context/v1/menus", params);
export const reqUserPermission = (params: RolePageReq[]) =>
  http.post("/embodied-user-api/manager/context/v1/permissions", params);


