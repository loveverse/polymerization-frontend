import http from "@/utils/http"
import { AddModuleReq, ModuleDataRes, UpdateModuleReq } from "./types"
/* 模块管理 */
export const reqAddModule = (params: AddModuleReq) =>
  http.post("/auth-api/v1/system/module/create", params)
export const reqDelModule = (params: CommonId) =>
  http.delete("/auth-api/v1/system/module/delete", params)
export const reqUpdateModule = (params: UpdateModuleReq) =>
  http.put("/auth-api/v1/system/module/update", params)
export const reqModuleList = () => http.get<ModuleDataRes[]>("/auth-api/v1/system/module/list")
