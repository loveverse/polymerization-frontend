import http from "@/utils/http";
import {
  AreaTreeRes,
  ChapterTreeReq,
  ChapterTreeRes,
  GradeListRes,
  PeriodListRes,
  UpdateUserPasswordReq,
  UserInfo,
} from "./types";

/* 学段列表 */
export const reqPeriodList = () =>
  http.post<PeriodListRes[]>("/embodied-user-api/manager/bs-period/v1/list");
// 获取个人信息
export const reqUserInfo = () =>
  http.post<UserInfo>("/embodied-user-api/manager/personal/v1/getInfo");
// 修改个人信息
export const reqUpdateUserInfo = (params: UserInfo) =>
  http.post("/embodied-user-api/manager/personal/v1/updateInfo", params);
// 修改密码
export const reqUpdateUserPassword = (params: UpdateUserPasswordReq) =>
  http.post("/embodied-user-api/manager/personal/v1/updatePassword", params);

// 获取行政地区树
export const reqAreaTree = (params: { maxLevel: number }) =>
  http.post<AreaTreeRes[]>("/embodied-user-api/china-area/v1/tree", params);

// 年级列表
export const reqGradeList = (params?: { periodIds: string[] }) =>
  http.post<GradeListRes[]>("/embodied-user-api/manager/bs-period-grade/v1/list", params);

export const reqBaseCourseData = (params?: { courseClassify?: string }) =>
  http.post("/embodied-user-api/manager/base/period_grade_book/v1/all", params);
// 获取资源tree
export const reqChapterTree = (params: ChapterTreeReq) =>
  http.post<ChapterTreeRes[]>(
    "/embodied-question-api/manager/bs-chapter-knowledge/v3/tree",
    params
  );
// 获取实验tree
export const reqExperimentChapterTree = (params: ChapterTreeReq) =>
  http.post<ChapterTreeRes[]>("/embodied-experiment-api/api/experiment/get/course_node", params);
