import http from "@/utils/http";

import {uploadUrl} from "../../../../config";
import {UploadFileRes} from "./types";
// 上传文件
export const reqUploadFile = (params: FormData) =>
  http.post<UploadFileRes>(uploadUrl + "/file/upload", params, "formData");
