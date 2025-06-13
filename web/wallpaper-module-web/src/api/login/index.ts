import http from "@/utils/http.ts";
import {CaptchaImgReq, ReqLoginForm, ResLogin, UserInfoRes} from "@/api/login/types.ts";

export const reqLogin = (params: ReqLoginForm) =>
  http.post<ResLogin>("/auth-api/auth/v1/login", params);

export const reqCaptchaImg = (params: CaptchaImgReq) => http.get("/auth-api/auth/v1/captcha/" + params.uuid, params.params);
// 获取用户信息
export const reqUserInfo = () => http.post<UserInfoRes>("/smart-user-api/bs-teacher/v1/getInfo");
// 退出登录
export const reqLogOut = () => http.post("/smart-classroom-api/smart-context/v1/logout");
