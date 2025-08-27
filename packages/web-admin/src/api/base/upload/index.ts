import { uploadUrl } from "@/config"
import http from "@/utils/http"
import { ResponseFile, UploadExcelRes } from "./types"

// 上传文件
export const reqUploadFile = (params: FormData) =>
  http.post<ResponseFile>(uploadUrl + "/file/v1/upload", params, "formData")
export const reqUploadExcel = (params: FormData) =>
  http.post<UploadExcelRes>(
    "/embodied-question-api/manager/bs-question-school/v1/uploadExcelData",
    params,
    "formData",
  )
