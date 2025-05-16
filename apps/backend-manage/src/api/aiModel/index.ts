import http from "@/utils/http";
import {
  AddAiModelReq,
  AddExperimentContentReq,
  AddExperimentReportReq,
  AddExperimentReq,
  AddExperimentStepReq,
  AddModelTagReq,
  AiModelListRes,
  DelAiModelReq,
  EditAiModelReq,
  EditExperimentReq,
  EditExperimentScoreReq,
  EditModelTagReq,
  ExperimentListReq,
  ExperimentListRes,
  ExperimentPageReq,
  ModelTagListReq,
  ModelTagListRes,
  ViewExperimentRes,
} from "./types";
// ai模型
export const reqAiModelList = () =>
  http.get<AiModelListRes[]>("/embodied-experiment-api/api/ai/get_all/ai_model");
export const reqAddAiModel = (params: AddAiModelReq) =>
  http.post("/embodied-experiment-api/api/ai/create", params);
export const reqEditAiModel = (params: EditAiModelReq) =>
  http.post("/embodied-experiment-api/api/ai/edit", params);
export const reqDelAiModel = (params: CommonId) =>
  http.get("/embodied-experiment-api/api/ai/delete/" + params.id);

// 模型标签
export const reqModelTagList = (params: ModelTagListReq) =>
  http.get<ModelTagListRes[]>("/embodied-experiment-api/api/ai/list/tags/" + params.aiId);
export const reqAddModelTag = (params: AddModelTagReq) =>
  http.post("/embodied-experiment-api/api/ai/create_ai_tag/" + params.aiId, params.tagList);
export const reqEditModelTag = (params: EditModelTagReq) =>
  http.post("/embodied-experiment-api/api/ai/edit_ai_tag", params);
export const reqDelModelTag = (params: DelAiModelReq) =>
  http.get(`/embodied-experiment-api/api/ai/delete/tag/${params.tagId}`, undefined, "urlencoded");
// 添加实验内容
export const reqAddExperimentContent = (params: AddExperimentContentReq) =>
  http.post("/embodied-experiment-api/api/ai/create/content/" + params.aiId, params);
// 添加实验步骤
export const reqAddExperimentStep = (params: AddExperimentStepReq) =>
  http.post(`/embodied-experiment-api/api/ai/create/step/${params.contentId}`, params.list);
// 添加实验报告
export const reqAddExperimentReport = (params: AddExperimentReportReq) =>
  http.post(`/embodied-experiment-api/api/ai/create/report/${params.contentId}`, params.list);
// 获取实验列表
export const reqExperimentList = (params: ExperimentListReq) =>
  http.post<PageRes<ExperimentListRes>>(
    `/embodied-experiment-api/api/ai/get/contents/${params.aiId}`,
    params
  );
// 创建实验
export const reqAddExperiment = (params: AddExperimentReq) =>
  http.post("/embodied-experiment-api/api/experiment/create", params);
export const reqEditExperiment = (params: EditExperimentReq) =>
  http.post("/embodied-experiment-api/api/experiment/edit", params);
// 删除考题
export const reqDelExperiment = (params: { contentId: string }) =>
  http.post(
    "/embodied-experiment-api/api/ai/del/report/" + params.contentId,
    undefined,
    "urlencoded"
  );
export const reqViewExperiment = (params: { aiContentId: string }) =>
  http.get<ViewExperimentRes>(
    "/embodied-experiment-api/api/ai/get/question/all",
    params,
    "urlencoded"
  );
// 获取实验分页列表
export const reqExperimentPage = (params: ExperimentPageReq) =>
  http.post<RecordRes>("/embodied-experiment-api/api/experiment/getPageList", params);

// 查看实验内容
export const reqViewExperimentContent = (params: CommonId) =>
  http.get("/embodied-experiment-api/api/experiment/get/" + params.id, undefined, "urlencoded");
// 删除实验
export const reqDelExperimentContent = (params: CommonId) =>
  http.post("/embodied-experiment-api/api/experiment/del/" + params.id, undefined, "urlencoded");
// 编辑实验分值
export const reqEditExperimentScore = (params: EditExperimentScoreReq) =>
  http.post("/embodied-experiment-api/api/experiment/editNum", params);
