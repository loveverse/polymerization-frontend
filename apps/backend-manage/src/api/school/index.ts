import http from "@/utils/http";
import {
  SchoolPageReq,
  SchoolPageRes,
  AddSchoolReq,
  UpdateSchoolReq,
  SchoolRoleListRes,
  SetSchoolMenuReq,
  UpdateSchoolsValid,
  UpdateSchoolStatusReq,
} from "./types";

export const reqSchoolPage = (params: SchoolPageReq) =>
  http.post<PageRes<SchoolPageRes>>("/embodied-user-api/manager/school/v1/page", params);
export const reqAddSchool = (params: AddSchoolReq) =>
  http.post("/embodied-user-api/manager/school/v1/add", params);
export const reqUpdateSchool = (params: UpdateSchoolReq) =>
  http.post("/embodied-user-api/manager/school/v1/update", params);

export const reqUpdateSchoolStatus = (params: UpdateSchoolStatusReq) =>
  http.post("/embodied-user-api/manager/school/v1/updateIsDisabled", params);
export const reqDelSchool = (params: CommonId) =>
  http.post("/embodied-user-api/manager/school/v1/delete", params);
// 修改有效期
export const reqUpdateSchoolsValid = (params: UpdateSchoolsValid) =>
  http.post("/embodied-user-api/manager/school/v1/updateValidTime", params);
export const reqSchoolRoleList = (params: CommonId) =>
  http.post<SchoolRoleListRes>("/embodied-user-api/manager/bs-school/v1/one_with_menu", params);
// 设置学校菜单
export const reqSetSchoolMenu = (params: SetSchoolMenuReq) =>
  http.post("/embodied-user-api/manager/bs-school/v1/set_menu", params);
