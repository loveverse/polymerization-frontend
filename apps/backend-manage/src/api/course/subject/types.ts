/* 学科 */
export interface SubjectListRes {
  id: string;
  updateTime: number;
  createTime: number;
  subjectName: string;
  orderValue: number;
}
export interface AddSubjectReq {
  subjectName: string;
}
export type EditSubjectReq = AddSubjectReq & CommonId;

/* 课程类型 */
export interface CourseTypeListRes {
  id: string;
  updateTime: number;
  createTime: number;
  courseTypeName: string;
  orderValue: number;
}
export interface AddCourseTypeReq {
  courseTypeName: string;
}
export type EditCourseTypeReq = AddCourseTypeReq & CommonId;
/* 教材版本 */
export interface TextbookVersionListRes {
  id: string;
  updateTime: number;
  createTime: number;
  versionName: string;
  orderValue: number;
}
export interface TextbookVersionPageRes extends PageReq {
  data: object;
}
export interface AddTextbookVersionReq {
  versionName: string;
}
export type EditTextbookVersionReq = AddTextbookVersionReq & CommonId;
