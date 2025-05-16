import http from "@/utils/http";
import {
  DeviceCountBySchoolRes,
  ExperimentAndPracticeInfoReq,
  ExperimentAndPracticeInfoRes,
  SchoolCountRes,
  SetUpCourseInfoReq,
} from "./types";

export const reqSchoolCount = (params: { schoolId?: string }) =>
  http.get<SchoolCountRes>("/embodied-user-api/home/getSchoolDataCount", params);
export const reqSetUpCourseInfo = (params: SetUpCourseInfoReq) =>
  http.post<DeviceCountBySchoolRes[]>(
    "/embodied-user-api/home/getExperimentAndPracticeByCourse",
    params
  );
export const reqDeviceCountBySchool = (params: { schoolId?: string }) =>
  http.get<DeviceCountBySchoolRes[]>("/embodied-user-api/home/getDeviceDataCount", params);
export const reqExperimentAndPracticeInfo = (params: ExperimentAndPracticeInfoReq) =>
  http.post<ExperimentAndPracticeInfoRes>(
    "/embodied-user-api/home/getExperimentAndPracticeByDate",
    params
  );
