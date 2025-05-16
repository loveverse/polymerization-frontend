import http from "@/utils/http";
import { AddServerReq, DeviceListRes, EditServerReq, ServerListRes } from "./types";

export const reqServerList = () =>
  http.post<ServerListRes[]>("/embodied-experiment-api/api/server/device/serverList");

export const reqAddServer = (params: AddServerReq) =>
  http.post("/embodied-experiment-api/api/server/device/create", params);
export const reqEditServer = (params: EditServerReq) =>
  http.post("/embodied-experiment-api/api/server/device/edit", params);
export const reqDelServer = (params: CommonId) =>
  http.post("/embodied-experiment-api/api/server/device/del/" + params.id, undefined, "urlencoded");
export const reqAbnormalDeviceList = (params: CommonId) =>
  http.post<DeviceListRes[]>(
    "/embodied-experiment-api/api/server/device/serverListError/" + params.id
  );
