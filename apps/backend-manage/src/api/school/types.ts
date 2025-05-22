import { Dayjs } from "dayjs";
import { PeriodListRes } from "../base/common/types";

/* 学校管理 */
export interface SchoolPageParam extends PageParam {
  data: {
    dateRange?: number[];
    schoolName?: string;
    isDisabled?: number;
    areaId?: number | number[];
    periodIds?: string[];
    validTimeSort?: string;
  };
}
export interface AddSchoolReq {
  contacts: string;
  contactsPhone: string;
  periodIds: string[];
  areaId: number | number[];
  validStartTime: number;
  isDisabled: number | string;
  schoolName: string;
  address?: string;
  validEndTime: number;
  times?: number[] | Dayjs[];
}
export type UpdateSchoolReq = AddSchoolReq & CommonId;
export type UpdateSchoolStatusReq = Pick<AddSchoolReq, "isDisabled"> & CommonId;
export interface SchoolDataRes {
  id: string;
  version: string;
  valid: number;
  updateTime: number;
  createTime: number;
  schoolName: string;
  schoolImg: string;
  periods: PeriodListRes[];
  region: string;
  moduleIds: string[];
  periodIds: string[];
  areaId: string;
  isDisabled: number;
  validStartTime: number;
  validEndTime: number;
  contacts: string;
  contactsPhone: string;
  adminId: string;
  schoolAdmin: string;
}
export interface SchoolRoleListRes {
  id?: string;
  version?: string;
  valid?: number;
  updateTime?: number;
  createTime?: number;
  schoolName?: string;
  schoolImg?: string;
  region?: string;
  moduleIds: string[];
  periodIds: string[];
  menuIds: string[];
}
export interface SetSchoolMenuReq {
  id: string;
  menuIds: string[];
}
export interface UpdateSchoolsValid {
  ids: string[];
  validStartTime: number;
  validEndTime: number;
}
