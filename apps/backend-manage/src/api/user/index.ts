import http from "@/utils/http";
import { AddUserReq, UpdateUserReq, UpdateUserStatusReq, UserDataRes } from "./types";
/* 用户管理 */
export const reqUserPage = (params: PageParam) =>
  http.post<PageResult<UserDataRes>>("/embodied-user-api/manager/user/v1/page", params);
export const reqAddUser = (params: AddUserReq) =>
  http.post("/embodied-user-api/manager/user/v1/add", params);
export const reqUpdateUser = (params: UpdateUserReq) =>
  http.post("/embodied-user-api/manager/user/v1/update", params);
export const reqUpdateUserStatus = (params: UpdateUserStatusReq) =>
  http.post("/embodied-user-api/manager/user/v1/updateLock", params);
export const reqResetUserPassword = (params: UpdateUserStatusReq) =>
  http.post("/embodied-user-api/manager/user/v1/updatePassword", params);

export const reqDelUser = (params: CommonId) =>
  http.post("/embodied-user-api/manager/user/v1/delete", params);
