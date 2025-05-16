import http from "@/utils/http/index";
import {
  UploadResourceReq,
  QuoteResourceReq,
  SyncToPersonalReq,
  MultimediaPageReq,
  MultimediaPageRes,
  EditResourceReq,
} from "./types";

// 教学资源分页查询
export const reqMultimediaPage = (params: MultimediaPageReq) =>
  http.post<PageRes<MultimediaPageRes>>(
    "/embodied-question-api/manager/multimedia/v1/page",
    params
  );
// 上传多媒体资源
export const reqUploadResource = (params: UploadResourceReq) =>
  http.post("/embodied-question-api/manager/multimedia/v1/add", params);
// 修改多媒体资源
export const reqEditResource = (params: EditResourceReq) =>
  http.post("/embodied-question-api/manager/multimedia/v1/update", params);
// 删除多媒体资源
export const reqDelResource = (params: CommonId) =>
  http.post("/embodied-question-api/manager/multimedia/v1/delete", params);

// 移除备课多媒体资源
export const reqRemoveResource = (params: { resourcePrepareLessonId: string }) =>
  http.post("/embodied-question-api/resourcePrepareLesson/v1/delete", params);
// 调用多媒体资源
export const reqQuoteResource = (params: QuoteResourceReq) =>
  http.post("/embodied-question-api/resourcePrepareLesson/v1/referenceResource", params);
// 备课同步到个人资源
export const reqSyncToPersonal = (params: SyncToPersonalReq) =>
  http.post("/embodied-question-api/resourcePrepareLesson/v1/syncPersonalResource", params);
export const reqAddDownloadNumber = (params: CommonId) =>
  http.post("/embodied-question-api/multimedia/v1/addDownloadNumber", params);
