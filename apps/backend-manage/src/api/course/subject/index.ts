import http from "@/utils/http";
import {
  AddCourseTypeReq,
  AddSubjectReq,
  AddTextbookVersionReq,
  CourseTypeListRes,
  EditCourseTypeReq,
  EditSubjectReq,
  EditTextbookVersionReq,
  SubjectListRes,
  TextbookVersionListRes,
  TextbookVersionPageRes,
} from "./types";

export const reqSubjectList = () =>
  http.post<SubjectListRes[]>("/embodied-user-api/manager/subject/v1/list");
export const reqAddSubject = (params: AddSubjectReq) =>
  http.post("/embodied-user-api/manager/subject/v1/add", params);
export const reqEditSubject = (params: EditSubjectReq) =>
  http.post("/embodied-user-api/manager/subject/v1/update", params);
export const reqDelSubject = (params: CommonId) =>
  http.post("/embodied-user-api/manager/subject/v1/delete", params);

export const reqCourseTypeList = () =>
  http.post<CourseTypeListRes[]>("/embodied-user-api/manager/course_type/v1/list");
export const reqAddCourseType = (params: AddCourseTypeReq) =>
  http.post("/embodied-user-api/manager/course_type/v1/add", params);
export const reqEditCourseType = (params: EditCourseTypeReq) =>
  http.post("/embodied-user-api/manager/course_type/v1/update", params);
export const reqDelCourseType = (params: CommonId) =>
  http.post("/embodied-user-api/manager/course_type/v1/delete", params);

export const reqTextbookVersionList = (params: TextbookVersionPageRes) =>
  http.post<PageRes<TextbookVersionListRes>>(
    "/embodied-user-api/manager/textBookVersion/v1/page",
    params
  );
export const reqAddTextbookVersion = (params: AddTextbookVersionReq) =>
  http.post("/embodied-user-api/manager/textBookVersion/v1/add", params);
export const reqEditTextbookVersion = (params: EditTextbookVersionReq) =>
  http.post("/embodied-user-api/manager/textBookVersion/v1/update", params);
export const reqDelTextbookVersion = (params: CommonId) =>
  http.post("/embodied-user-api/manager/textBookVersion/v1/delete", params);
