import http from "@/utils/http";
import { TargetLibraryListRes } from "./types";
//查询指标库详情
export const getLibraryId = (params: any) =>
  http.get("/embodied-user-api/manager/metrics/v1/qry-repository-metrics/", params);
//更新指标库详情
export const getUpdateLibrary = (params: any) =>
  http.post("/embodied-user-api/manager/metrics/v1/update-metrics-by-repository", params);
export const reqAddTargetLibrary = (params: { subjectId: string }) =>
  http.post("/embodied-user-api/manager/metrics-repository/v1/create", params);
export const reqDelTargetLibrary = (params: CommonId) =>
  http.get("/embodied-user-api/manager/metrics-repository/v1/delete", params);
export const reqTargetLibraryList = () =>
  http.get<TargetLibraryListRes[]>("/embodied-user-api/manager/metrics-repository/v1/list");
