import http from "@/utils/http"
import { AuthorityInfoRes, LoginInfoReq, LoginInfoRes } from "./types"
import { CommonId } from "@poly/shared"

export const reqLogin = (params: LoginInfoReq) =>
  http.post<LoginInfoRes>("/auth-api/v1/auth/login", params)
// 获取权限信息
export const reqAuthorityInfo = (params: CommonId) =>
  http.get<AuthorityInfoRes>("/auth-api/v1/auth/authority-info/" + params.id)

// 退出登录
export const reqLogOut = () => http.post("/auth-api/v1/auth/logout")
