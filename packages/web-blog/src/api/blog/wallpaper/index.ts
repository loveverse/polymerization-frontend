import http from "@/utils/http"
import { PageFind } from "@/api/blog/wallpaper/types.ts"

// 分页查询
export const reqImgList = (params: PageFind) => http.get("/wallpaper/findList", params)
