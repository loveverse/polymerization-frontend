type CountType =
  | "schoolCount"
  | "teacherCount"
  | "studentCount"
  | "experimentCount"
  | "practiceCount";
export type SchoolCountRes = Record<CountType, number>;
export interface CountList {
  img: string;
  color: string;
  text: string;
  count: number;
  key: CountType;
}
export interface SetUpCourseInfoReq {
  courseClassify?: string;
  dateRange: number;
  schoolId?: string;
}
export interface DeviceCountBySchoolRes {
  name: string;
  count: number;
}
export interface ExperimentAndPracticeInfoReq {
  schoolId?: string;
  dateRange: number; // 日期范围：1-周，2-月，3-季度，4-年
}

interface DateCount {
  date: string;
  count: Count;
}

interface Count {
  experiment: number;
  practice: number;
}
export interface ExperimentAndPracticeInfoRes {
  sumCount: number;
  experimentCount: number;
  aiExperimentCount: number;
  cgExperimentCount: number;
  practiceCount: number;
  dateCount: DateCount[];
}
