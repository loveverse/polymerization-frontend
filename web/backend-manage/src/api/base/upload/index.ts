import { uploadUrl } from "@/config";
import http from "@/utils/http";
import { SaveUploadExcelReq, UploadExcelData, UploadExcelRes, UploadFileRes } from "./types";

// 上传文件
export const reqUploadFile = (params: FormData) =>
  http.post<UploadFileRes>(uploadUrl + "/file/v1/upload", params, "formData");
export const reqUploadExcel = (params: FormData) =>
  http.post<UploadExcelRes>(
    "/embodied-question-api/manager/bs-question-school/v1/uploadExcelData",
    params,
    "formData"
  );
export const reqCheckUploadExcel = (params: UploadExcelData[]) =>
  http.post("/embodied-question-api/manager/bs-question-school/v1/checkExcelData", params);
//
export const reqSaveUploadExcel = (params: SaveUploadExcelReq) =>
  http.post("/embodied-question-api/manager/bs-question-school/v1/saveExcelData", params);
