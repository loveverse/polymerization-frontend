import http from "@/utils/http";
import {LoginInfoReq, LoginInfoRes, UserMenuReq} from "./types";
import { RolePageParam } from "../system/types";


export const reqLogin = (params: LoginInfoReq) =>
  http.post<LoginInfoRes>("/auth-api/auth/v1/login", params);


// 页面初始化
export const reqUserRole = () =>
  http.post<RolePageParam[]>("/embodied-user-api/manager/context/v1/roles");
export const reqUserMenu = (params: RolePageParam[]) =>
  http.post<UserMenuReq[]>("/embodied-user-api/manager/context/v1/menus", params);
export const reqUserPermission = (params: RolePageParam[]) =>
  http.post("/embodied-user-api/manager/context/v1/permissions", params);

// 退出登录
export const reqLogOut = () => http.post("/embodied-user-api/manager/context/v1/logout");
