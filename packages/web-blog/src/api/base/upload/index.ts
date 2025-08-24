import http from "@/utils/http"
import { uploadUrl } from "@/config"
import { UploadFileRes } from "./types"
// 上传文件
export const reqUploadFile = (params: FormData) =>
  http.post<UploadFileRes>(uploadUrl + "/file/upload", params, "formData")

// 函数可传可不传
export const reqUpload = (params: any, callback?: Function) =>
  http.post("/upload/file", params, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 0,
    onUploadProgress: function (progressEvent) {
      // 处理原生进度事件
      callback && callback(progressEvent)
    },
  })
// 粘贴上传
export const reqPasteUpload = (params: any, callback?: Function) =>
  http.post("/paste/upload/file", params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    timeout: 0,
    onUploadProgress: function (progressEvent) {
      // 处理原生进度事件
      callback && callback(progressEvent)
    },
  })
