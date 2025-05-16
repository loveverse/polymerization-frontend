import http from "@/utils/http";
import { AddModuleReq, ModuleListRes, UpdateModuleReq } from "./types";
/* 模块管理 */
export const reqModuleList = () =>
  http.post<ModuleListRes[]>("/embodied-user-api/manager/sys-modules/v1/list");
export const reqAddModule = (params: AddModuleReq) =>
  http.post("/embodied-user-api/manager/sys-modules/v1/add", params);
export const reqUpdateModule = (params: UpdateModuleReq) =>
  http.post("/embodied-user-api/manager/sys-modules/v1/update", params);
export const reqDelModule = (params: CommonId) =>
  http.post("/embodied-user-api/manager/sys-modules/v1/delete", params);
