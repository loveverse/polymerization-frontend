import http from "@/utils/http"
import axios from "axios"

// 下载文件
export const reqDownloadFile = async (url: string): Promise<Blob | null> => {
  try {
    const res = await axios.get(url, { responseType: "blob" })
    return new Blob([res.data], { type: res.headers["Content-Type"] as string })
  } catch (err) {
    console.error(err)
    return null
  }
}

// 通用下载模板
export const reqDownloadExcelTemplate = async (params: { key: string }) =>
  http.get<Blob>("/auth-api/v1/common-excel/download/" + params.key, undefined, "jsonBlob")
