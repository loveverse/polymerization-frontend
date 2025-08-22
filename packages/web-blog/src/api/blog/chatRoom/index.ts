import http from "@/utils/http.ts"
import { AddExcerptReq, DelExcerptReq, UpdExcerptReq } from "@/api/blog/chatRoom/types.ts"

// 书摘API---------------------------------------
export const reqFindExcerptData = () => http.get("/findExcerpt")
export const reqAddExcerptData = (params: AddExcerptReq) => http.get("/addExcerpt", params)
export const reqUpdateExcerptData = (params: UpdExcerptReq) => http.get("/updateExcerpt", params)
export const reqDelExcerptData = (params: DelExcerptReq) => http.get("/delExcerpt", params)
