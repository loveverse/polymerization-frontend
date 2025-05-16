import http from "@/utils/http";
import {
  AddCourseReq,
  CoursePageReq,
  CoursePageRes,
  EditCourseReq,
  UpdateCourseStatusReq,
} from "./types";

// 课程分页列表
export const reqCoursePage = (params: CoursePageReq) =>
  http.post<PageRes<CoursePageRes>>("/embodied-user-api/manager/course/v1/page", params);
export const reqCourseList = (params: CoursePageReq["data"]) =>
  http.post<CoursePageRes[]>("/embodied-user-api/manager/course/v1/list", params);
export const reqAddCourse = (params: AddCourseReq) =>
  http.post("/embodied-user-api/manager/course/v1/add", params);
export const reqEditCourse = (params: EditCourseReq) =>
  http.post("/embodied-user-api/manager/course/v1/update", params);
export const reqUpdateCourseStatus = (params: UpdateCourseStatusReq) =>
  http.post("/embodied-user-api/manager/course/v1/update_disabled", params);
export const reqDelCourse = (params: CommonId) =>
  http.post("/embodied-user-api/manager/course/v1/delete", params);
