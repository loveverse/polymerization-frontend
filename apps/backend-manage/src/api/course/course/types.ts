// 课程分页
export interface CoursePageReq extends PageReq {
  data: {
    subjectName?: string;
    periodId?: string;
    courseTypeId?: string;
    disabled?: number; // 0:开启, 1:关闭
    isRelativeLab?: number; // 1:实验课程，0:非实验课程
    courseClassify?: string;
  };
}
export interface CoursePageRes {
  id: string;
  updateTime: number;
  createTime: number;
  subjectName: string;
  orderValue: number;
  periods: Omit<PeriodVos, "courseVos">[];
  subjectType: string;
  subjectId: string;
  courseTypeId: string;
  disabled: number | boolean;
  newSubjectName: string;
  courseTypeName: string;
  courseClassify: string;
  [key: string]: any;
}

export interface AddCourseReq {
  subjectName: string;
  subjectId: string;
  courseTypeId: string;
  periodIds: string[];
  courseClassify: string;
}
export type EditCourseReq = AddCourseReq & CommonId;
export type UpdateCourseStatusReq = Pick<CoursePageRes, "id" | "disabled">;
