import http from "@/utils/http.ts"

// 查询文件列表
export const reqFileList = () => http.post("/file/list")
// 保存文件信息
export const reqSaveFile = (params: any) => http.post("/save/list", params)
// 删除文件
export const reqDelFile = (params: any) => http.post("/delete/file", params)
